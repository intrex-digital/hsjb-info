import Sidebar from '../components/layout/Sidebar'
import ScrollToTopButton from '../components/layout/ScrollToTopButton'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Resume from '../components/sections/Resume'
import BlogPreview from '../components/sections/BlogPreview'
import Services from '../components/sections/Services'
import Contact from '../components/sections/Contact'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Hero />
        <About />
        <Skills />
        <Resume />
        <BlogPreview />
        <Services />
        <Contact />
        <Footer />
      </main>
      <ScrollToTopButton />
    </>
  )
}
