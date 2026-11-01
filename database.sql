-- Create database (run this first in psql or pgAdmin)
-- CREATE DATABASE inkosi_chorale;

-- Connect to the database
\c inkosi_chorale;

-- Create applicants table
CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    church_origin VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    voice_type VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL,
    song_choice_1 VARCHAR(200) NOT NULL,
    song_choice_2 VARCHAR(200) NOT NULL,
    inkhosi_song VARCHAR(200) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    CHECK (voice_type IN ('Soprano', 'Alto', 'Tenor', 'Bass')),
    CHECK (age >= 18)
);

-- Create admin user (password: admin123 - change in production)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Insert default admin (password: admin123)
-- In production, use proper hashing. This is bcrypt hash of 'admin123'
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVtQH8ZxYO')
ON CONFLICT (username) DO NOTHING;

-- Create index for faster searches
CREATE INDEX idx_applicants_voice ON applicants(voice_type);
CREATE INDEX idx_applicants_district ON applicants(district);
CREATE INDEX idx_applicants_status ON applicants(status);

-- Sample query to view all applicants
-- SELECT * FROM applicants ORDER BY registration_date DESC;