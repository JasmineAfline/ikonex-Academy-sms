'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ResultsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [studentResult, setStudentResult] = useState<any>(null);
  const [tab, setTab] = useState<'class' | 'individual'>('class');

  useEffect(() => {
    Promise.all([api.get('/streams'), api.get('/students')])
      .then(([s, st]) => { setStreams(s.data); setStudents(st.data); });
  }, []);

  useEffect(() => {
    if (selectedStream) api.get(`/results/stream/${selectedStream}`).then(r => setResults(r.data)).catch(() => setResults([]));
  }, [selectedStream]);

  useEffect(() => {
    if (selectedStudent) api.get(`/results/student/${selectedStudent}`).then(r => setStudentResult(r.data)).catch(() => setStudentResult(null));
  }, [selectedStudent]);

  const gradeColor = (grade: string) => {
    if (grade === 'A') return 'badge-green';
    if (grade === 'F') return 'badge-red';
    if (grade === 'B') return 'badge-blue';
    return 'badge-yellow';
  };

  const tabStyle = (t: string) => ({
    padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
    background: tab === t ? 'var(--primary)' : 'transparent',
    color: tab === t ? '#fff' : 'var(--text-muted)', border: 'none'
  });

  return (
    <div>
      <div className="page-header">
        <h1>Results</h1>
        <p>View class rankings and individual student performance</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-2)', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '1.5rem' }}>
        <button style={tabStyle('class')} onClick={() => setTab('class')}>Class Results</button>
        <button style={tabStyle('individual')} onClick={() => setTab('individual')}>Individual Result</button>
      </div>

      {tab === 'class' && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Select Class Stream</label>
              <select value={selectedStream} onChange={e => setSelectedStream(e.target.value)} style={{ maxWidth: '300px' }}>
                <option value="">Choose a stream...</option>
                {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {selectedStream && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/pdf/class/${selectedStream}`} target="_blank" style={{ textDecoration: 'none' }}>
                <button className="btn-primary">Download Class Report PDF</button>
              </a>
            </div>
          )}

          {results.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Position</th><th>Student Name</th><th>Admission No.</th><th>Total Marks</th><th>Average</th><th>Subjects</th></tr>
                </thead>
                <tbody>
                  {results.map(s => (
                    <tr key={s.id} style={{ background: s.position === 1 ? 'var(--primary-light)' : '' }}>
                      <td>
                        <span style={{ fontWeight: 700, color: s.position <= 3 ? 'var(--primary)' : 'var(--text-primary)' }}>
                          #{s.position}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                      <td><span className="badge badge-blue">{s.admission_number}</span></td>
                      <td style={{ fontWeight: 600 }}>{s.total_marks}</td>
                      <td>{s.average}%</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.subjects_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedStream && !results.length && (
            <div className="table-wrapper"><div className="empty-state"><p>No results found for this stream.</p></div></div>
          )}
        </>
      )}

      {tab === 'individual' && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Select Student</label>
              <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ maxWidth: '300px' }}>
                <option value="">Choose a student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)}
              </select>
            </div>
          </div>

          {studentResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Marks', value: studentResult.summary.total_marks },
                  { label: 'Average Score', value: `${studentResult.summary.average}%` },
                  { label: 'Subjects Sat', value: studentResult.summary.number_of_subjects },
                ].map(stat => (
                  <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/pdf/student/${selectedStudent}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary">Download Report Card PDF</button>
                </a>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Subject</th><th>Exam</th><th>CA</th><th>Total</th><th>Grade</th><th>Remark</th></tr>
                  </thead>
                  <tbody>
                    {studentResult.scores.map((s: any) => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 500 }}>{s.subject_name}</td>
                        <td>{s.exam_score}</td>
                        <td>{s.ca_score}</td>
                        <td style={{ fontWeight: 600 }}>{s.total_score}</td>
                        <td><span className={`badge ${gradeColor(s.grade)}`}>{s.grade}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{s.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}