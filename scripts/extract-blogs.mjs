import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const blogsDir = join(process.cwd(), 'old portfolio', 'blogs')
const outputFile = join(process.cwd(), 'backend', 'src', 'db', 'blog-seed.sql')

function escapeSql(str) {
  if (!str) return 'NULL'
  return "'" + str.replace(/'/g, "''").replace(/\n/g, ' ').trim() + "'"
}

function extractContent(html) {
  // Extract content between <div class="content"> and the closing </div> before social links
  const contentMatch = html.match(/<div class="content">([\s\S]*?)(?=<div class="d-flex justify-content-between)/)
  if (!contentMatch) return null
  
  let content = contentMatch[1]
  // Clean up the content - remove tech-summary-box div wrapper but keep content
  content = content.replace(/<div class="tech-summary-box">/g, '<div class="tech-summary-box">')
  return content.trim()
}

function extractTitle(html) {
  // Try to extract from h2 in content first
  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/)
  if (h2Match) {
    return h2Match[1].replace(/<[^>]*>/g, '').trim()
  }
  // Fallback to page title
  const titleMatch = html.match(/<title>(.*?)<\/title>/)
  return titleMatch ? titleMatch[1].replace(/ - Md\. Jobaer Hossain$/, '').trim() : 'Untitled'
}

function extractDate(html) {
  const dateMatch = html.match(/<i class="bi bi-calendar"><\/i>\s*(.*?)<\/span>/)
  return dateMatch ? dateMatch[1].trim() : 'Jan 2026'
}

function extractReadingTime(html) {
  const timeMatch = html.match(/<i class="bi bi-clock"><\/i>\s*(.*?)<\/span>/)
  return timeMatch ? timeMatch[1].trim() : '10 Min Read'
}

function generateSlug(title, index) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || `blog-${String(index).padStart(2, '0')}`
}

function determineCategory(title, content) {
  const lower = (title + ' ' + content).toLowerCase()
  if (lower.includes('network') || lower.includes('lan') || lower.includes('wan') || lower.includes('tcp') || lower.includes('ip')) return 'Networking'
  if (lower.includes('security') || lower.includes('zero trust') || lower.includes('firewall') || lower.includes('hardening')) return 'Security'
  if (lower.includes('windows') || lower.includes('server')) return 'Windows Server'
  if (lower.includes('linux') || lower.includes('centos') || lower.includes('ubuntu')) return 'Linux'
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure')) return 'Cloud'
  if (lower.includes('active directory') || lower.includes('ad ')) return 'Active Directory'
  if (lower.includes('monitoring') || lower.includes('grafana') || lower.includes('snmp')) return 'Monitoring'
  return 'Networking'
}

function calculateReadingTime(content) {
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} Min Read`
}

const sqlLines = []
sqlLines.push('-- Blog Posts Seed Data')
sqlLines.push('-- Generated from old portfolio HTML files')
sqlLines.push('')

const files = readdirSync(blogsDir).filter(f => f.startsWith('blog-') && f.endsWith('.html')).sort()

files.forEach((file, index) => {
  const num = index + 1
  const filePath = join(blogsDir, file)
  const html = readFileSync(filePath, 'utf-8')
  
  const title = extractTitle(html)
  const date = extractDate(html)
  const readingTime = extractReadingTime(html)
  const content = extractContent(html)
  const slug = generateSlug(title, num)
  const category = determineCategory(title, content || '')
  
  if (!content) {
    console.warn(`Warning: Could not extract content from ${file}`)
    return
  }
  
  const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 200).trim() + '...'
  
  sqlLines.push(`-- Blog Post ${num}: ${title}`)
  sqlLines.push(`INSERT INTO blog_posts (slug, title, excerpt, content, author, category, reading_time, published, created_at, updated_at) VALUES (`)
  sqlLines.push(`  ${escapeSql(slug)},`)
  sqlLines.push(`  ${escapeSql(title)},`)
  sqlLines.push(`  ${escapeSql(excerpt)},`)
  sqlLines.push(`  ${escapeSql(content)},`)
  sqlLines.push(`  'Md. Jobaer Hossain',`)
  sqlLines.push(`  ${escapeSql(category)},`)
  sqlLines.push(`  ${escapeSql(readingTime)},`)
  sqlLines.push(`  1,`)
  sqlLines.push(`  '${date}',`)
  sqlLines.push(`  '${date}'`)
  sqlLines.push(`);`)
  sqlLines.push('')
  
  console.log(`[${num}/37] Extracted: ${title}`)
})

writeFileSync(outputFile, sqlLines.join('\n'), 'utf-8')
console.log(`\nDone! Generated SQL for ${files.length} blog posts at: ${outputFile}`)
