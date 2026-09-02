import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import RichTextEditor from '../../components/admin/RichTextEditor'
import '../../styles/admin.css'

export default function AdminBlogEditor() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: 'Networking',
    reading_time: '5 Min Read',
    published: false,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await adminApi.blog.getAll(1, 100)
      const post = response.data.data.find((p) => p.id === Number(id))
      if (post) {
        setFormData({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          category: post.category,
          reading_time: post.reading_time || '5 Min Read',
          published: !!post.published,
        })
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = {
        ...formData,
        published: formData.published ? 1 : 0,
      }
      if (isEditing) {
        await adminApi.blog.update(Number(id), submitData)
      } else {
        await adminApi.blog.create(submitData)
      }
      navigate('/admin/blog')
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
          </h2>
          <button
            onClick={() => navigate('/admin/blog')}
            className="admin-btn admin-btn-secondary"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Blog
          </button>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="admin-form-select"
                >
                  <option value="Networking">Networking</option>
                  <option value="Security">Security</option>
                  <option value="Linux">Linux</option>
                  <option value="Windows Server">Windows Server</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Active Directory">Active Directory</option>
                  <option value="Monitoring">Monitoring</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Reading Time</label>
                <input
                  type="text"
                  name="reading_time"
                  value={formData.reading_time}
                  onChange={handleChange}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span className="admin-form-label" style={{ margin: 0 }}>Published</span>
                </label>
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="admin-form-textarea"
                />
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">Content *</label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                  placeholder="Start writing your blog post..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    Save Post
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/blog')}
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
