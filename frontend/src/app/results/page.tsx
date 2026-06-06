'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import * as S from '@/lib/styles';

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

  const tabBtn = (t: 'class' | 'individual', label: string) => (
    <button onClick={() => setTab(t)} style={{
      padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
      fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
      background: tab === t ? '#2563eb' : 'transparent',
      color: tab === t ? '#fff' : '#94a3b8',
    }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Results</h1>
        <p style={{ color: '#94a3b8', marginTop: '3px', fontSize: '13px' }}>View class rankings and individual student performance</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '1.5rem' }}>
        {tabBtn('class', 'Class Results')}
        {tabBtn('individual', 'Individual Result')}
      </div>

      {tab === 'class' && (
        <>
          <div style={{ ...S.card, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ ...S.formGroup, maxWidth: '300px' }}>
                <label style={S.label}>Select Class Stream</label>
                <select style={S.select} value={selectedStream} onChange={e => setSelectedStream(e.target.value)}>
                  <option value="">Choose a stream...</option>
                  {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              {selectedStream && (
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/pdf/class/${selectedStream}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button style={S.btnPrimary}>Download Class Report PDF</button>
                </a>
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div style={S.tableWrapper}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Position', 'Student Name', 'Admission No.', 'Total Marks', 'Average', 'Subjects'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {results.map(s => (
                    <tr key={s.id}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                      <td style={S.td}>
                        <span style={{ fontWeight: 700, color: s.position <= 3 ? '#2563eb' : '#0f172a', fontSize: s.position === 1 ? '15px' : '14px' }}>
                          #{s.position}
                        </span>
                      </td>
                      <td style={{ ...S.td, fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                      <td style={S.td}><span style={S.badge('blue')}>{s.admission_number}</span></td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{s.total_marks}</td>
                      <td style={S.td}>{s.average}%</td>
                      <td style={{ ...S.td, color: '#94a3b8' }}>{s.subjects_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedStream && !results.length && (
            <div style={S.tableWrapper}><div style={S.emptyState}>No results found for this stream.</div></div>
          )}
        </>
      )}

      {tab === 'individual' && (
        <>
          <div style={{ ...S.card, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ ...S.formGroup, maxWidth: '300px' }}>
                <label style={S.label}>Select Student</label>
                <select style={S.select} value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                  <option value="">Choose a student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)}
                </select>
              </div>
              {selectedStudent && (
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/pdf/student/${selectedStudent}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button style={S.btnPrimary}>Download Report Card PDF</button>
                </a>
              )}
            </div>
          </div>

          {studentResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Marks', value: studentResult.summary.total_marks },
                  { label: 'Average Score', value: `${studentResult.summary.average}%` },
                  { label: 'Subjects Sat', value: studentResult.summary.number_of_subjects },
                ].map(stat => (
                  <div key={stat.label} style={{ ...S.card, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2563eb' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={S.tableWrapper}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Subject', 'Exam', 'CA', 'Total', 'Grade', 'Remark'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {studentResult.scores.map((s: any) => (
                      <tr key={s.id}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                        <td style={{ ...S.td, fontWeight: 500 }}>{s.subject_name}</td>
                        <td style={S.td}>{s.exam_score}</td>
                        <td style={S.td}>{s.ca_score}</td>
                        <td style={{ ...S.td, fontWeight: 600 }}>{s.total_score}</td>
                        <td style={S.td}><span style={S.gradeBadge(s.grade)}>{s.grade}</span></td>
                        <td style={{ ...S.td, color: '#94a3b8' }}>{s.remark}</td>
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