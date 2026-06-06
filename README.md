# Ikonex Academy Student Management System

A full-stack web-based Student Management System built for Ikonex Academy.

## Live URLs
- **Frontend:** https://ikonex-academy-sms-8fzr.vercel.app
- **Backend API:** https://ikonex-academy-sms.vercel.app/api

## GitHub Repository
https://github.com/JasmineAfline/ikonex-Academy-sms

## Tech Stack
- **Frontend:** Next.js 16 (TypeScript, Tailwind CSS)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Supabase)
- **Deployment:** Vercel (frontend + backend), Supabase (database)

## Features
- Class stream management (create, view, edit, delete)
- Student registration and management
- Subject management and assignment to streams
- Score recording (exam + continuous assessment)
- Automatic grade calculation with configurable grading scale
- Results processing with class rankings and positions
- PDF report card generation per student
- PDF class performance report generation

## Grading Scale
| Grade | Range | Remark |
|-------|-------|--------|
| A | 80 - 100 | Excellent |
| B | 70 - 79 | Very Good |
| C | 60 - 69 | Good |
| D | 50 - 59 | Average |
| F | 0 - 49 | Fail |

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL

### Backend
```bash
cd backend
cp .env.example .env

npm install
npm run migrate
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env.local

npm install
npm run dev
```

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000
- Test API: http://localhost:5000/api/health

## API Endpoints

### Streams
- `GET /api/streams` — get all streams
- `POST /api/streams` — create stream
- `PUT /api/streams/:id` — update stream
- `DELETE /api/streams/:id` — delete stream

### Students
- `GET /api/students` — get all students
- `POST /api/students` — register student
- `PUT /api/students/:id` — update student
- `DELETE /api/students/:id` — delete student
- `GET /api/students/stream/:streamId` — students by stream

### Subjects
- `GET /api/subjects` — get all subjects
- `POST /api/subjects` — create subject
- `PUT /api/subjects/:id` — update subject
- `DELETE /api/subjects/:id` — delete subject
- `POST /api/subjects/assign` — assign subject to stream

### Scores
- `POST /api/scores` — record score
- `PUT /api/scores/:id` — update score
- `GET /api/scores/student/:studentId` — student scores

### Results
- `GET /api/results/student/:studentId` — individual result
- `GET /api/results/stream/:streamId` — class results with rankings

### PDF Reports
- `GET /api/pdf/student/:studentId` — download student report card
- `GET /api/pdf/class/:streamId` — download class performance report

## System Usage

### Step 1 — Create Class Streams
Go to **Class Streams** → Add streams like Form 1A, Form 1B

### Step 2 — Add Subjects
Go to **Subjects** → Add subjects like Mathematics (MATH), English (ENG)

### Step 3 — Register Students
Go to **Students** → Register students and assign them to streams

### Step 4 — Record Scores
Go to **Scores** → Select a student, select a subject, enter exam and CA scores

### Step 5 — View Results
Go to **Results** → Select a stream to see class rankings or select a student for individual results

### Step 6 — Download Reports
On the Results page, click **Download Student Report PDF** or **Download Class Report PDF**

## Deployment

- Backend and frontend both deployed on Vercel
- Database hosted on Supabase (PostgreSQL)
- Environment variables configured in Vercel dashboard