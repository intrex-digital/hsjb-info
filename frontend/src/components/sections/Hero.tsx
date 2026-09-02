import { useEffect, useRef } from 'react'

const titles = [
  'Technical Support Engineer.',
  'Network Engineer.',
  'System Administrator.',
  'Technical Instructor.',
]

export default function Hero() {
  const typedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let titleIndex = 0
    let charIndex = 0
    let isDeleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const type = () => {
      const currentTitle = titles[titleIndex % titles.length]

      if (isDeleting) {
        charIndex--
      } else {
        charIndex++
      }

      if (typedRef.current && currentTitle) {
        typedRef.current.textContent = currentTitle.substring(0, charIndex)
      }

      let typeSpeed = isDeleting ? 50 : 100

      if (!isDeleting && currentTitle && charIndex === currentTitle.length) {
        typeSpeed = 2000
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        titleIndex = (titleIndex + 1) % titles.length
        typeSpeed = 500
      }

      timeoutId = setTimeout(type, typeSpeed)
    }

    type()

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <section id="hero" className="hero">
      <img src="/hero-bg.jpg" alt="Hero Background" />
      <div className="container">
        <h2>Md. Jobaer Hossain</h2>
        <p>
          I&apos;m <span ref={typedRef} className="typed-cursor"></span>
        </p>
        <div className="social-links">
          <a href="https://www.facebook.com/jbhs.info/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.linkedin.com/in/hsjobaerlisedu/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-linkedin"></i>
          </a>
          <a href="https://wa.me/8801575267698/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-whatsapp"></i>
          </a>
          <a href="https://t.me/hsjb_info/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-telegram"></i>
          </a>
          <a href="https://discordapp.com/users/hsjobaerlisedu/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-discord"></i>
          </a>
        </div>
      </div>
    </section>
  )
}
