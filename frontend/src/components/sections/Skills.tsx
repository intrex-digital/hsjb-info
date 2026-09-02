const leftSkills = [
  { name: 'Hardware & Software', percentage: 90 },
  { name: 'AVoIP (SMPTE ST 2110)', percentage: 85 },
  { name: 'MikroTik RouterBoard', percentage: 90 },
  { name: 'Virtualization', percentage: 80 },
  { name: 'Endpoint Security', percentage: 85 },
  { name: 'Problem-Solving', percentage: 85 },
  { name: 'Operating Systems', percentage: 85 },
  { name: 'Cisco Switch', percentage: 85 },
  { name: 'Traffic Management', percentage: 85 },
]

const rightSkills = [
  { name: 'Windows Server', percentage: 90 },
  { name: 'KVM Management', percentage: 80 },
  { name: 'Technical Writing', percentage: 80 },
  { name: 'Networking (L2 & L3)', percentage: 90 },
  { name: 'Netgear Switch', percentage: 85 },
  { name: 'Network Monitoring', percentage: 85 },
  { name: 'Linux Administration', percentage: 85 },
  { name: 'Root Cause Analysis', percentage: 80 },
]

import { useState, useEffect, useRef } from 'react'

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="section skills" ref={sectionRef}>
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Skills</h2>
        </div>

        <div className="row skills-content skills-animation">
          <div className="col-lg-6" data-aos="fade-up">
            {leftSkills.map((skill) => (
              <div className="progress" key={skill.name}>
                <span className="skill">
                  <span>{skill.name}</span> <i className="val">{skill.percentage}%</i>
                </span>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow={skill.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ width: isVisible ? `${skill.percentage}%` : '1px' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            {rightSkills.map((skill) => (
              <div className="progress" key={skill.name}>
                <span className="skill">
                  <span>{skill.name}</span> <i className="val">{skill.percentage}%</i>
                </span>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow={skill.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ width: isVisible ? `${skill.percentage}%` : '1px' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
