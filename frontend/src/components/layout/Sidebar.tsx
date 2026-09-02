import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'bi-house', label: 'Home' },
  { path: '/#about', icon: 'bi-person', label: 'About' },
  { path: '/#skills', icon: 'bi-hammer', label: 'Skills' },
  { path: '/#resume', icon: 'bi-file-earmark-text', label: 'Resume' },
  { path: '/#blog', icon: 'bi-journal-text', label: 'Blogs' },
  { path: '/#services', icon: 'bi-hdd-stack', label: 'Services' },
  { path: '/#contact', icon: 'bi-envelope', label: 'Contact' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('/')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(location.pathname)
      return
    }

    const handleScroll = () => {
      const sections = ['about', 'skills', 'resume', 'blog', 'services', 'contact']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`/#${section}`)
            return
          }
        }
      }
      setActiveSection('/')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path === '/') {
      if (location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        e.preventDefault()
        navigate('/')
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
      }
      setIsOpen(false)
      return
    }

    if (path.startsWith('/#')) {
      e.preventDefault()
      const sectionId = path.slice(2)
      
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
      setIsOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        className="header-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      <header id="header" className={`header d-flex flex-column justify-content-center ${isOpen ? 'header-show' : ''}`}>
        <nav id="navmenu" className="navmenu">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={activeSection === item.path ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, item.path)}
                >
                  <i className={`bi ${item.icon} navicon`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  )
}
