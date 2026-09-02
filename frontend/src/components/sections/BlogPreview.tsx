import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogApi } from '../../services/api'
import type { BlogPost } from '../../types'

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await blogApi.getFeatured(9)
        setPosts(response.data)
      } catch (error) {
        console.error('Failed to fetch featured posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section id="blog" className="section blog">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Latest Blog Posts</h2>
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
                <div key={post.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                  <article className="blog-item">
                    <div className="blog-accent"></div>
                    <h3 className="post-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <div className="post-meta">
                      <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                      {' • '}
                      <span>{post.category}</span>
                    </div>
                    {post.excerpt && (
                      <p className="post-excerpt">{post.excerpt}</p>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/blog/${post.slug}`} className="read-more">
                        Read More <i className="bi bi-arrow-right"></i>
                      </Link>
                      <div className="social-links d-flex gap-2">
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/blog/' + post.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share-linkedin"
                        >
                          <i className="bi bi-linkedin" style={{ color: 'var(--accent-color)' }}></i>
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/blog/' + post.slug)}&text=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share-twitter"
                        >
                          <i className="bi bi-twitter-x" style={{ color: 'var(--accent-color)' }}></i>
                        </a>
                        <a
                          href="#"
                          className="share-general"
                          onClick={(e) => {
                            e.preventDefault()
                            if (navigator.share) {
                              navigator.share({
                                title: post.title,
                                url: window.location.origin + '/blog/' + post.slug,
                              })
                            }
                          }}
                        >
                          <i className="bi bi-share" style={{ color: 'var(--accent-color)' }}></i>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className="text-center mt-5" data-aos="fade-up">
              <Link to="/blog" className="btn btn-dark-pill">
                View All Posts <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
