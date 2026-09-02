import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
import ShareButtons from '../components/blog/ShareButtons'
import { blogApi } from '../services/api'
import type { BlogPost as BlogPostType } from '../types'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return

      try {
        const response = await blogApi.getBySlug(slug)
        setPost(response.data)
      } catch (err) {
        setError('Blog post not found')
        console.error('Failed to fetch blog post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <>
        <Sidebar />
        <main className="main-content">
          <div className="flex items-center justify-center min-h-screen">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <Sidebar />
        <main className="main-content">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2>Post Not Found</h2>
              <p className="text-muted mb-4">{error}</p>
              <Link to="/blog" className="btn-resume-style">
                <i className="bi bi-arrow-left"></i> Back to Blog
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <section className="page-title">
          <div className="container" data-aos="fade-up">
            <div className="mb-3">
              <Link to="/blog" className="text-reset d-inline-flex align-items-center" style={{ textDecoration: 'none', opacity: 0.7, transition: '0.3s' }}>
                <i className="bi bi-chevron-left me-1"></i> Back to Blogs
              </Link>
            </div>
            <h1>Technical Digest</h1>
          </div>
        </section>

        <section className="blog-details section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10" data-aos="fade-up">
                <div className="content-wrapper shadow-lg">
                  <div className="post-meta">
                    <span className="me-4">
                      <i className="bi bi-person"></i> {post.author}
                    </span>
                    <span className="me-4">
                      <i className="bi bi-calendar"></i>{' '}
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="me-4">
                      <i className="bi bi-clock"></i> {post.reading_time}
                    </span>
                  </div>

                  <h2 className="mb-4" style={{ fontWeight: 800, color: 'var(--heading-color)' }}>
                    {post.title}
                  </h2>

                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div className="d-flex justify-content-between align-items-center mt-5">
                    <Link to="/blog" className="btn-resume-style">
                      <i className="bi bi-arrow-left"></i> Back
                    </Link>
                    <ShareButtons title={post.title} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
