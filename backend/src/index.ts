import { Router } from 'itty-router'

interface Env {
  DB: D1Database
  ENVIRONMENT: string
  JWT_SECRET: string
}

const router = Router()

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Handle CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }))

// Simple JWT-like token functions (using base64 for demo - use proper JWT in production)
function createToken(data: { email: string; name: string }): string {
  const payload = JSON.stringify({ ...data, exp: Date.now() + 24 * 60 * 60 * 1000 })
  return btoa(payload)
}

function verifyToken(token: string): { email: string; name: string } | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) return null
    return { email: payload.email, name: payload.name }
  } catch {
    return null
  }
}

// Hash function (simple - use bcrypt in production)
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

// Health check
router.get('/api/health', () =>
  Response.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders })
)

// ==================== PUBLIC ROUTES ====================

// Blog routes - public
router.get('/api/blog/featured', async (_request, env) => {
  const url = new URL(_request.url)
  const limit = Number(url.searchParams.get('limit')) || 9
  const results = await env.DB.prepare(
    'SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC LIMIT ?'
  ).bind(limit).all()
  return Response.json(results.results, { headers: corsHeaders })
})

router.get('/api/blog', async (request) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1
  const limit = Number(url.searchParams.get('limit')) || 9
  const offset = (page - 1) * limit
  const db = (request as any).env?.DB

  if (!db) {
    return Response.json({ data: [], total: 0, page, limit, totalPages: 0 }, { headers: corsHeaders })
  }

  const countResult = await db.prepare('SELECT COUNT(*) as total FROM blog_posts WHERE published = 1').first()
  const total = (countResult as any)?.total || 0

  const results = await db
    .prepare('SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all()

  return Response.json({ data: results.results, total, page, limit, totalPages: Math.ceil(total / limit) }, { headers: corsHeaders })
})

router.get('/api/blog/:slug', async ({ params }, env) => {
  const result = await env.DB.prepare(
    'SELECT * FROM blog_posts WHERE slug = ? AND published = 1'
  ).bind(params.slug).first()
  if (!result) {
    return Response.json({ success: false, message: 'Post not found' }, { status: 404, headers: corsHeaders })
  }
  return Response.json(result, { headers: corsHeaders })
})

// Portfolio routes - public
router.get('/api/portfolio/skills', async (_request, env) => {
  const results = await env.DB.prepare('SELECT * FROM skills ORDER BY display_order ASC').all()
  return Response.json(results.results, { headers: corsHeaders })
})

router.get('/api/portfolio/resume', async (_request, env) => {
  const results = await env.DB.prepare('SELECT * FROM resume_entries ORDER BY display_order ASC').all()
  return Response.json(results.results, { headers: corsHeaders })
})

// Contact route - public
router.post('/api/contact', async (request) => {
  try {
    const body = await request.json() as { name?: string; email?: string; subject?: string; message?: string }
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return Response.json({ success: false, message: 'Name, email, and message are required' }, { status: 400, headers: corsHeaders })
    }

    const db = (request as any).env?.DB
    if (db) {
      await db.prepare('INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)').bind(name, email, subject || '', message).run()
    }

    return Response.json({ success: true, message: 'Message sent successfully' }, { status: 201, headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to send message' }, { status: 500, headers: corsHeaders })
  }
})

// ==================== ADMIN AUTH ROUTES ====================

router.post('/api/admin/login', async (request, env) => {
  try {
    const body = await request.json() as { email?: string; password?: string }
    const { email, password } = body

    if (!email || !password) {
      return Response.json({ success: false, message: 'Email and password required' }, { status: 400, headers: corsHeaders })
    }

    const user = await env.DB.prepare('SELECT * FROM admin_users WHERE email = ?').bind(email).first() as any
    if (!user) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401, headers: corsHeaders })
    }

    // Simple password check (use bcrypt in production)
    if (user.password_hash !== password) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401, headers: corsHeaders })
    }

    // Update last login
    await env.DB.prepare('UPDATE admin_users SET last_login = datetime("now") WHERE id = ?').bind(user.id).run()

    const token = createToken({ email: user.email, name: user.name })

    return Response.json({ success: true, token, user: { email: user.email, name: user.name } }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Login failed' }, { status: 500, headers: corsHeaders })
  }
})

router.get('/api/admin/verify', async (request) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ success: false, message: 'No token' }, { status: 401, headers: corsHeaders })
  }

  const token = authHeader.slice(7)
  const user = verifyToken(token)
  if (!user) {
    return Response.json({ success: false, message: 'Invalid token' }, { status: 401, headers: corsHeaders })
  }

  return Response.json({ success: true, user }, { headers: corsHeaders })
})

// ==================== ADMIN PROTECTED ROUTES ====================

// Middleware to check auth
const requireAuth = async (request: Request) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: corsHeaders })
  }
  const token = authHeader.slice(7)
  const user = verifyToken(token)
  if (!user) {
    return Response.json({ success: false, message: 'Invalid token' }, { status: 401, headers: corsHeaders })
  }
  return null // null means pass
}

// Dashboard stats
router.get('/api/admin/stats', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  const [blogCount, skillCount, resumeCount, contactCount, unreadCount] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as count FROM blog_posts').first() as Promise<any>,
    env.DB.prepare('SELECT COUNT(*) as count FROM skills').first() as Promise<any>,
    env.DB.prepare('SELECT COUNT(*) as count FROM resume_entries').first() as Promise<any>,
    env.DB.prepare('SELECT COUNT(*) as count FROM contact_submissions').first() as Promise<any>,
    env.DB.prepare('SELECT COUNT(*) as count FROM contact_submissions WHERE read = 0').first() as Promise<any>,
  ])

  return Response.json({
    blogPosts: blogCount?.count || 0,
    skills: skillCount?.count || 0,
    resumeEntries: resumeCount?.count || 0,
    contacts: contactCount?.count || 0,
    unreadContacts: unreadCount?.count || 0,
  }, { headers: corsHeaders })
})

// Blog CRUD - Admin
router.get('/api/admin/blog', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1
  const limit = Number(url.searchParams.get('limit')) || 20
  const offset = (page - 1) * limit

  const countResult = await env.DB.prepare('SELECT COUNT(*) as total FROM blog_posts').first() as any
  const total = countResult?.total || 0

  const results = await env.DB.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(limit, offset).all()

  return Response.json({ data: results.results, total, page, limit, totalPages: Math.ceil(total / limit) }, { headers: corsHeaders })
})

router.post('/api/admin/blog', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json() as any
    const { slug, title, excerpt, content, category, reading_time, published } = body

    if (!slug || !title || !content) {
      return Response.json({ success: false, message: 'Slug, title, and content required' }, { status: 400, headers: corsHeaders })
    }

    const result = await env.DB.prepare(
      'INSERT INTO blog_posts (slug, title, excerpt, content, category, reading_time, published) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(slug, title, excerpt || '', content, category || 'Networking', reading_time || '5 Min Read', published ? 1 : 0).run()

    return Response.json({ success: true, id: result.meta?.last_row_id }, { status: 201, headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to create post' }, { status: 500, headers: corsHeaders })
  }
})

router.put('/api/admin/blog/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { params } = request
    const body = await request.json() as any
    const { slug, title, excerpt, content, category, reading_time, published } = body

    await env.DB.prepare(
      'UPDATE blog_posts SET slug=?, title=?, excerpt=?, content=?, category=?, reading_time=?, published=?, updated_at=datetime("now") WHERE id=?'
    ).bind(slug, title, excerpt || '', content, category || 'Networking', reading_time || '5 Min Read', published ? 1 : 0, params.id).run()

    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to update post' }, { status: 500, headers: corsHeaders })
  }
})

router.delete('/api/admin/blog/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    await env.DB.prepare('DELETE FROM blog_posts WHERE id=?').bind(request.params.id).run()
    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to delete post' }, { status: 500, headers: corsHeaders })
  }
})

// Skills CRUD - Admin
router.get('/api/admin/skills', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  const results = await env.DB.prepare('SELECT * FROM skills ORDER BY display_order ASC').all()
  return Response.json(results.results, { headers: corsHeaders })
})

router.post('/api/admin/skills', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json() as any
    const { name, percentage, category, display_order } = body

    if (!name || percentage === undefined) {
      return Response.json({ success: false, message: 'Name and percentage required' }, { status: 400, headers: corsHeaders })
    }

    const result = await env.DB.prepare(
      'INSERT INTO skills (name, percentage, category, display_order) VALUES (?, ?, ?, ?)'
    ).bind(name, percentage, category || '', display_order || 0).run()

    return Response.json({ success: true, id: result.meta?.last_row_id }, { status: 201, headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to create skill' }, { status: 500, headers: corsHeaders })
  }
})

router.put('/api/admin/skills/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { params } = request
    const body = await request.json() as any
    const { name, percentage, category, display_order } = body

    await env.DB.prepare(
      'UPDATE skills SET name=?, percentage=?, category=?, display_order=? WHERE id=?'
    ).bind(name, percentage, category || '', display_order || 0, params.id).run()

    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to update skill' }, { status: 500, headers: corsHeaders })
  }
})

router.delete('/api/admin/skills/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    await env.DB.prepare('DELETE FROM skills WHERE id=?').bind(request.params.id).run()
    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to delete skill' }, { status: 500, headers: corsHeaders })
  }
})

// Resume CRUD - Admin
router.get('/api/admin/resume', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  const results = await env.DB.prepare('SELECT * FROM resume_entries ORDER BY display_order ASC').all()
  return Response.json(results.results, { headers: corsHeaders })
})

router.post('/api/admin/resume', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json() as any
    const { type, title, organization, date_range, join_date, exit_date, description, display_order } = body

    if (!type || !title) {
      return Response.json({ success: false, message: 'Type and title required' }, { status: 400, headers: corsHeaders })
    }

    const result = await env.DB.prepare(
      'INSERT INTO resume_entries (type, title, organization, date_range, join_date, exit_date, description, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(type, title, organization || '', date_range || '', join_date || '', exit_date || '', description || '', display_order || 0).run()

    return Response.json({ success: true, id: result.meta?.last_row_id }, { status: 201, headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to create entry' }, { status: 500, headers: corsHeaders })
  }
})

router.put('/api/admin/resume/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { params } = request
    const body = await request.json() as any
    const { type, title, organization, date_range, join_date, exit_date, description, display_order } = body

    await env.DB.prepare(
      'UPDATE resume_entries SET type=?, title=?, organization=?, date_range=?, join_date=?, exit_date=?, description=?, display_order=? WHERE id=?'
    ).bind(type, title, organization || '', date_range || '', join_date || '', exit_date || '', description || '', display_order || 0, params.id).run()

    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to update entry' }, { status: 500, headers: corsHeaders })
  }
})

router.delete('/api/admin/resume/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    await env.DB.prepare('DELETE FROM resume_entries WHERE id=?').bind(request.params.id).run()
    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to delete entry' }, { status: 500, headers: corsHeaders })
  }
})

// Contacts - Admin
router.get('/api/admin/contacts', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  const results = await env.DB.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all()
  return Response.json(results.results, { headers: corsHeaders })
})

router.put('/api/admin/contacts/:id/read', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    await env.DB.prepare('UPDATE contact_submissions SET read = 1 WHERE id = ?').bind(request.params.id).run()
    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to mark as read' }, { status: 500, headers: corsHeaders })
  }
})

router.delete('/api/admin/contacts/:id', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    await env.DB.prepare('DELETE FROM contact_submissions WHERE id=?').bind(request.params.id).run()
    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to delete' }, { status: 500, headers: corsHeaders })
  }
})

// Settings - Admin
router.get('/api/admin/settings', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  const results = await env.DB.prepare('SELECT * FROM site_config').all()
  const settings: Record<string, string> = {}
  for (const row of results.results) {
    settings[row.key as string] = row.value as string
  }
  return Response.json(settings, { headers: corsHeaders })
})

router.put('/api/admin/settings', async (request, env) => {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const data = await request.json() as Record<string, string>
    
    for (const [key, value] of Object.entries(data)) {
      await env.DB.prepare(
        'INSERT OR REPLACE INTO site_config (key, value) VALUES (?, ?)'
      ).bind(key, value).run()
    }
    
    return Response.json({ success: true }, { headers: corsHeaders })
  } catch {
    return Response.json({ success: false, message: 'Failed to update settings' }, { status: 500, headers: corsHeaders })
  }
})

// 404 handler
router.all('*', () =>
  Response.json({ success: false, message: 'Not found' }, { status: 404, headers: corsHeaders })
)

export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
    ;(request as any).env = env
    return router.handle(request, env, ctx)
  },
}
