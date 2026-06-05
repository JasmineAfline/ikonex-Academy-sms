'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ResultsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [studentResult, setStudentResult] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    api.get('/streams').then(r => setStreams(r.data));
    api.get('/students').then(r => setStudents(r.data));
  }, []);

  const loadStreamResults = async (id: string) => {
    setSelectedStream(id);
    const res = await api.get(`/results/stream/${id}`);
    setResults(res.data);
  };

  const loadStudentResult = async (id: string) => {
    setSelectedStudent(id);
    const res = await api.get(`/results/student/${id}`);
    setStudentResult(res.data);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Results</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Class Results</h2>
          <select value={selectedStream} onChange={e => loadStreamResults(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
            <option value="">Select stream</option>
            {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
  {selectedStudent && (
    <a href={`http://localhost:5000/api/pdf/student/${selectedStudent}`} target="_blank"
      style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
      ⬇ Download Student Report PDF
    </a>
  )}
  {selectedStream && (
    <a href={`http://localhost:5000/api/pdf/class/${selectedStream}`} target="_blank"
      style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
      ⬇ Download Class Report PDF
    </a>
  )}
</div>

          <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Individual Result</h2>
          <select value={selectedStudent} onChange={e => loadStudentResult(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
            <option value="">Select student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
          </select>
        </div>
      </div>

      {results.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>{['Position', 'Name', 'Admission #', 'Total Marks', 'Average', 'Subjects'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {results.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6', background: s.position === 1 ? '#fefce8' : 'white' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: s.position <= 3 ? '#d97706' : '#111' }}>#{s.position}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.admission_number}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.total_marks}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{s.average}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.subjects_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {studentResult && (
        <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{studentResult.student.first_name} {studentResult.student.last_name}</h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Stream: {studentResult.student.stream_name} | Average: {studentResult.summary.average} | Total: {studentResult.summary.total_marks}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>{['Subject', 'Exam', 'CA', 'Total', 'Grade', 'Remark'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {studentResult.scores.map((s: any) => (
                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.subject_name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{s.exam_score}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{s.ca_score}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.total_score}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: s.grade === 'A' ? '#d1fae5' : s.grade === 'F' ? '#fee2e2' : '#fef3c7', color: s.grade === 'A' ? '#065f46' : s.grade === 'F' ? '#991b1b' : '#92400e', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>{s.grade}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}