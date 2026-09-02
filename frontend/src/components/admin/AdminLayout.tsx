import { useState, useEffect } from 'react'
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

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
      <aside
        className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-brand">
            <i className="bi bi-person-gear"></i>
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-link sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            {!sidebarCollapsed && <span>Collapse</span>}
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
            <Link to="/" target="_blank" className="admin-btn admin-btn-secondary admin-btn-sm">
              <i className="bi bi-box-arrow-up-right"></i>
              View Site
            </Link>
            <button onClick={handleLogout} className="admin-btn admin-btn-secondary admin-btn-sm">
              <i className="bi bi-box-arrow-left"></i>
              Logout
            </button>
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
