import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
import { blogApi } from '../services/api'
import type { BlogPost } from '../types'

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogApi.getAll(page, 9)
        setPosts(response.data.data)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page])

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <section className="section blog">
          <div className="container">
            <div className="section-title">
              <h2>Blog</h2>
              <p>Technical articles and insights</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row gy-4">
                  {posts.map((post, index) => (
                    <div key={post.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                      <div className="blog-item">
                        <div className="blog-accent"></div>
                        <h4 className="post-title">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                        <div className="post-meta">
                          <span>
                            <i className="bi bi-folder"></i> {post.category}
                          </span>
                          {' • '}
                          <span>
                            <i className="bi bi-clock"></i> {post.reading_time}
                          </span>
                          {' • '}
                          <span>
                            <i className="bi bi-calendar"></i>{' '}
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {post.excerpt && (
                          <div className="post-excerpt">{post.excerpt}</div>
                        )}
                        <Link to={`/blog/${post.slug}`} className="read-more">
                          Read More <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="text-center mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`btn btn-sm mx-1 ${
                            p === page
                              ? 'btn-primary'
                              : 'btn-outline-secondary'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
