import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    skills: 0,
    resumeEntries: 0,
    contacts: 0,
    unreadContacts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats()
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="stats-grid">
        <Link to="/admin/blog" className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-journal-text"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.blogPosts}</h3>
            <p>Blog Posts</p>
          </div>
        </Link>

        <Link to="/admin/skills" className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-gear"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.skills}</h3>
            <p>Skills</p>
          </div>
        </Link>

        <Link to="/admin/resume" className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-file-earmark-text"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.resumeEntries}</h3>
            <p>Resume Entries</p>
          </div>
        </Link>

        <Link to="/admin/contacts" className="stat-card">
          <div className="stat-icon orange">
            <i className="bi bi-envelope"></i>
          </div>
          <div className="stat-info">
            <h3>
              {stats.contacts}
              {stats.unreadContacts > 0 && (
                <span className="stat-badge">{stats.unreadContacts} new</span>
              )}
            </h3>
            <p>Messages</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Quick Actions</h2>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/admin/blog/new" className="admin-btn admin-btn-primary">
              <i className="bi bi-plus-lg"></i>
              New Blog Post
            </Link>
            <Link to="/admin/skills" className="admin-btn admin-btn-secondary">
              <i className="bi bi-gear"></i>
              Manage Skills
            </Link>
            <Link to="/admin/resume" className="admin-btn admin-btn-secondary">
              <i className="bi bi-file-earmark-text"></i>
              Manage Resume
            </Link>
            <Link to="/admin/contacts" className="admin-btn admin-btn-secondary">
              <i className="bi bi-envelope"></i>
              View Messages
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Getting Started</h2>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="stat-icon blue" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                <i className="bi bi-journal-plus"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Create Your First Blog Post</h4>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  Share your networking expertise with the world.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="stat-icon green" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                <i className="bi bi-gear"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Add Your Skills</h4>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  Showcase your technical proficiencies.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="stat-icon purple" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                <i className="bi bi-person-badge"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Update Your Resume</h4>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  Add your experience, education, and certifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
