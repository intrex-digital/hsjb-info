import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/admin.css'
import type { BlogPost } from '../../types'

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    try {
      const response = await adminApi.blog.getAll(page)
      setPosts(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await adminApi.blog.delete(id)
      fetchPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
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
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>All Blog Posts</h2>
          <Link to="/admin/blog/new" className="admin-btn admin-btn-primary">
            <i className="bi bi-plus-lg"></i>
            New Post
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <i className="bi bi-journal-text"></i>
                      <h3>No blog posts yet</h3>
                      <p>Create your first blog post to get started.</p>
                      <Link to="/admin/blog/new" className="admin-btn admin-btn-primary">
                        <i className="bi bi-plus-lg"></i>
                        Create Post
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{post.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>/{post.slug}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{post.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`admin-btn ${p === page ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
