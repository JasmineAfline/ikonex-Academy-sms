CREATE TABLE IF NOT EXISTS streams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  stream_id INTEGER REFERENCES streams(id) ON DELETE SET NULL,
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stream_subjects (
  id SERIAL PRIMARY KEY,
  stream_id INTEGER REFERENCES streams(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(stream_id, subject_id)
);

CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  exam_score NUMERIC(5,2) DEFAULT 0,
  ca_score NUMERIC(5,2) DEFAULT 0,
  total_score NUMERIC(5,2) GENERATED ALWAYS AS (exam_score + ca_score) STORED,
  term VARCHAR(20) NOT NULL DEFAULT 'Term 1',
  academic_year VARCHAR(10) NOT NULL DEFAULT '2025',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_id, term, academic_year)
);

CREATE TABLE IF NOT EXISTS grading_scale (
  id SERIAL PRIMARY KEY,
  min_score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  grade VARCHAR(5) NOT NULL,
  remark VARCHAR(50)
);

INSERT INTO grading_scale (min_score, max_score, grade, remark) VALUES
  (80, 100, 'A', 'Excellent'),
  (70, 79.99, 'B', 'Very Good'),
  (60, 69.99, 'C', 'Good'),
  (50, 59.99, 'D', 'Average'),
  (0,  49.99, 'F', 'Fail')
ON CONFLICT DO NOTHING;