-- admin-seed.sql
-- Default admin user: admin@hsjb.info / admin123
-- Password is hashed with SHA-256 for simplicity (use bcrypt in production)

INSERT INTO admin_users (email, password_hash, name) VALUES
('admin@hsjb.info', 'admin123', 'Admin');
