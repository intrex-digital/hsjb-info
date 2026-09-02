-- seed.sql

-- Skills
INSERT INTO skills (name, percentage, category, display_order) VALUES
('Hardware & Software', 90, 'Technical', 1),
('MikroTik RouterBoard', 90, 'Networking', 2),
('Windows Server', 90, 'Systems', 3),
('Networking (L2 & L3)', 90, 'Networking', 4),
('AVoIP (SMPTE ST 2110)', 85, 'Specialized', 5),
('Virtualization', 80, 'Systems', 6),
('Endpoint Security', 85, 'Security', 7),
('Problem-Solving', 85, 'Soft Skills', 8),
('Operating Systems', 85, 'Systems', 9),
('Cisco Switch', 85, 'Networking', 10),
('Traffic Management', 85, 'Networking', 11),
('KVM Management', 80, 'Systems', 12),
('Technical Writing', 80, 'Soft Skills', 13),
('Netgear Switch', 85, 'Networking', 14),
('Network Monitoring', 85, 'Networking', 15),
('Linux Administration', 85, 'Systems', 16),
('Root Cause Analysis', 80, 'Soft Skills', 17);

-- Resume Entries - Experience
INSERT INTO resume_entries (type, title, organization, date_range, description, display_order) VALUES
('experience', 'Senior Executive - IT', 'One Entertainment Limited', '2022 - Present', '<p>Leading IT operations and infrastructure management for a major entertainment company.</p><ul><li>Managing enterprise network infrastructure</li><li>Overseeing server administration and maintenance</li><li>Implementing security protocols and monitoring systems</li></ul>', 1),
('experience', 'Network Engineer', 'InComIT Solution', '2021 - 2022', '<p>Designed and implemented network solutions for enterprise clients.</p><ul><li>Configured MikroTik and Cisco network equipment</li><li>Managed LAN/WAN infrastructure</li><li>Provided technical support and troubleshooting</li></ul>', 2),
('experience', 'Support Engineer', 'One Sky Communications', '2020 - 2021', '<p>Provided technical support for satellite communication systems.</p><ul><li>Maintained AVoIP equipment (SMPTE ST 2110)</li><li>Troubleshot hardware and software issues</li><li>Documented technical procedures</li></ul>', 3);

-- Resume Entries - Education
INSERT INTO resume_entries (type, title, organization, date_range, description, display_order) VALUES
('education', 'BA in Library and Information Science', 'University of Dhaka', '2018 - 2022', '<p>Graduated with a focus on information management and technology.</p>', 4),
('education', 'Higher Secondary Certificate (HSC)', 'Dhaka Board', '2016 - 2018', '<p>Science group with focus on Physics, Chemistry, and Mathematics.</p>', 5),
('education', 'Secondary School Certificate (SSC)', 'Dhaka Board', '2014 - 2016', '<p>Science group with distinction.</p>', 6);

-- Resume Entries - Certifications
INSERT INTO resume_entries (type, title, organization, date_range, description, display_order) VALUES
('certification', 'NETGEAR AV Level 1', 'NETGEAR', '2023', '<p>Professional certification in NETGEAR AV networking solutions.</p>', 7),
('certification', 'Dante Level 1 & 2', 'Audinate', '2023', '<p>Certification in Dante audio networking protocol.</p>', 8),
('certification', 'Server Admin Level 5', 'ICT Division Bangladesh', '2022', '<p>Advanced server administration certification.</p>', 9),
('certification', 'Web Design Level 3', 'ICT Division Bangladesh', '2021', '<p>Professional web design and development certification.</p>', 10),
('certification', 'IT Support Level 3 & 4', 'ICT Division Bangladesh', '2020', '<p>IT support and troubleshooting certification.</p>', 11);

-- Resume Entries - Training
INSERT INTO resume_entries (type, title, organization, date_range, description, display_order) VALUES
('training', 'Fortinet Network Security', 'Fortinet', '2023', '<p>Advanced network security training with Fortinet products.</p>', 12),
('training', 'APNIC Network Operations', 'APNIC', '2022', '<p>Network operations and management training.</p>', 13),
('training', 'Koha Library System', 'Koha Community', '2022', '<p>Open-source library management system training.</p>', 14),
('training', 'Cisco CCNA', 'Cisco', '2021', '<p>Cisco Certified Network Associate training.</p>', 15),
('training', 'CompTIA A+', 'CompTIA', '2020', '<p>Foundational IT support and troubleshooting training.</p>', 16);

-- Site Config
INSERT INTO site_config (key, value) VALUES
('site_title', 'Md. Jobaer Hossain | Technical Support Engineer'),
('site_description', 'Technical Support Engineer | Network Engineer | System Administrator'),
('contact_email', 'info@hsjb.info'),
('phone', '+880 1575-267698'),
('location', 'Malibagh, Dhaka, Bangladesh');

-- Blog Posts (37 posts extracted from old portfolio)
-- See blog-seed.sql for full blog post data
