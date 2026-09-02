import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { path: '/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
  { path: '/admin/blog', icon: 'bi-journal-text', label: 'Blog Posts' },
  { path: '/admin/skills', icon: 'bi-gear', label: 'Skills' },
  { path: '/admin/resume', icon: 'bi-file-earmark-text', label: 'Resume' },
  { path: '/admin/contacts', icon: 'bi-envelope', label: 'Messages' },
  { path: '/admin/settings', icon: 'bi-sliders', label: 'Settings' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-brand">
            <i className="bi bi-person-gear"></i>
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </Link>
          <button
            className="sidebar-toggle d-none d-lg-block"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" target="_blank" className="sidebar-link">
            <i className="bi bi-box-arrow-up-right"></i>
            {!sidebarCollapsed && <span>View Site</span>}
          </Link>
          <button onClick={handleLogout} className="sidebar-link logout">
            <i className="bi bi-box-arrow-left"></i>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn d-lg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
            <h1 className="page-title">
              {menuItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <span className="user-name">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}
