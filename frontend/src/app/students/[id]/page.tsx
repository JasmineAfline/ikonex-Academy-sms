'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/students/${id}`),
      api.get(`/scores/student/${id}`),
      api.get(`/results/student/${id}`),
    ]).then(([s, sc, r]) => {
      setStudent(s.data);
      setScores(sc.data);
      setResult(r.data);
    }).catch(() => router.push('/students'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!student) return null;

  const gradeColor = (grade: string) => {
    if (grade === 'A') return 'badge-green';
    if (grade === 'F') return 'badge-red';
    if (grade === 'B') return 'badge-blue';
    return 'badge-yellow';
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/students" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          &larr; Back to Students
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            {student.first_name[0]}{student.last_name[0]}
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{student.first_name} {student.last_name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '1rem' }}>{student.stream_name || 'No stream assigned'}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Admission No.', value: student.admission_number },
              { label: 'Gender', value: student.gender || '—' },
              { label: 'Date of Birth', value: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '—' },
              { label: 'Stream', value: student.stream_name || '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/pdf/student/${id}`} target="_blank" style={{ textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
            <button className="btn-primary" style={{ width: '100%' }}>Download Report Card</button>
          </a>
        </div>

        <div>
          {result && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Marks', value: result.summary.total_marks },
                { label: 'Average Score', value: `${result.summary.average}%` },
                { label: 'Subjects', value: result.summary.number_of_subjects },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Exam</th>
                  <th>CA</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {scores.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.subject_name}</td>
                    <td>{s.exam_score}</td>
                    <td>{s.ca_score}</td>
                    <td style={{ fontWeight: 600 }}>{s.total_score}</td>
                    <td><span className={`badge ${gradeColor(s.grade)}`}>{s.grade}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.remark || '—'}</td>
                  </tr>
                ))}
                {!scores.length && (
                  <tr><td colSpan={6}><div className="empty-state"><p>No scores recorded yet.</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}