const services = [
  {
    icon: 'bi-pc-display',
    title: 'Hardware & Software Troubleshooting',
    description:
      'Diagnose and resolve hardware and software issues to ensure smooth system performance and minimal downtime.',
  },
  {
    icon: 'bi-hdd-network',
    title: 'Network Solutions',
    description:
      'Providing secure and scalable network designs, installations, and maintenance tailored to your business needs.',
  },
  {
    icon: 'bi-hdd-rack',
    title: 'Server Solutions',
    description:
      'Server setup, configuration, and management for optimized performance, reliability, and scalability.',
  },
  {
    icon: 'bi-menu-button-wide-fill',
    title: 'Virtualization Technologies',
    description:
      'Implementing virtual environments to maximize resource efficiency, reduce hardware costs, and streamline IT management.',
  },
  {
    icon: 'bi-cloud-haze',
    title: 'Cloud Computing',
    description:
      'Cloud solutions for storage, computing, and software services that enhance flexibility, collaboration, and scalability.',
  },
  {
    icon: 'bi-easel',
    title: 'Professional Training',
    description:
      'Comprehensive training programs designed to boost employee IT skills, productivity, and confidence.',
  },
]

export default function Services() {
  return (
    <section id="services" className="section services light-background">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Services</h2>
        </div>

        <div className="row gy-4">
          {services.map((service, index) => (
            <div key={service.title} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
              <div className="service-item position-relative">
                <div className="icon">
                  <i className={`bi ${service.icon}`}></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
