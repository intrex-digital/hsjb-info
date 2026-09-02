import { useState, useEffect } from 'react'

export default function ScrollToTopButton() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsActive(window.scrollY > 100)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-top ${isActive ? 'active' : ''}`}
      aria-label="Scroll to top"
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  )
}
