import { useState, useEffect } from 'react'
import { portfolioApi } from '../../services/api'
import type { ResumeEntry } from '../../types'

export default function Resume() {
  const [entries, setEntries] = useState<ResumeEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await portfolioApi.getResume()
        setEntries(response.data)
      } catch (error) {
        console.error('Failed to fetch resume:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getDateRange = (entry: ResumeEntry) => {
    if (entry.date_range) return entry.date_range
    if (entry.join_date) {
      const join = formatDate(entry.join_date)
      const exit = entry.exit_date ? formatDate(entry.exit_date) : 'Present'
      return `${join} - ${exit}`
    }
    return ''
  }

  const experience = entries.filter((e) => e.type === 'experience')
  const education = entries.filter((e) => e.type === 'education')
  const certifications = entries.filter((e) => e.type === 'certification')
  const training = entries.filter((e) => e.type === 'training')

  if (loading) {
    return (
      <section id="resume" className="resume section">
        <div className="container text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="resume" className="resume section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Resume</h2>
      </div>

      <div className="container">
        <div className="row">

          {/* Left Column */}
          <div className="col-lg-6">

            {/* Professional Experience */}
            {experience.length > 0 && (
              <div data-aos="fade-up" data-aos-delay="100">
                <h3 className="resume-title">Professional Experience</h3>
                {experience.map((entry) => (
                  <div key={entry.id} className="resume-item">
                    <h4>{entry.title}</h4>
                    <h5>{getDateRange(entry)}</h5>
                    {entry.organization && (
                      <p><em><strong>{entry.organization}</strong></em></p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div data-aos="fade-up" data-aos-delay="200">
                <h3 className="resume-title">Certifications &amp; Accreditations</h3>
                {certifications.map((entry) => (
                  <div key={entry.id} className="resume-item">
                    <h4>{entry.title}</h4>
                    <h5>{getDateRange(entry)}</h5>
                    {entry.organization && (
                      <p><em><strong>{entry.organization}</strong></em></p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
          {/* End Left Column */}

          {/* Right Column */}
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">

            {/* Education */}
            {education.length > 0 && (
              <div data-aos="fade-up" data-aos-delay="100">
                <h3 className="resume-title">Education</h3>
                {education.map((entry) => (
                  <div key={entry.id} className="resume-item">
                    <h4>{entry.title}</h4>
                    <h5>{getDateRange(entry)}</h5>
                    {entry.organization && (
                      <p><em>{entry.description}<br /><strong>{entry.organization}</strong></em></p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Training */}
            {training.length > 0 && (
              <div data-aos="fade-up" data-aos-delay="300">
                <h3 className="resume-title">Professional Training</h3>
                {training.map((entry) => (
                  <div key={entry.id} className="resume-item">
                    <h4>{entry.title}</h4>
                    <h5>{getDateRange(entry)}</h5>
                    {entry.organization && (
                      <p><em><strong>{entry.organization}</strong></em></p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
          {/* End Right Column */}

        </div>
      </div>
    </section>
  )
}
