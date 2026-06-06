'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import * as S from '@/lib/styles';

export default function StudentDetailPage({ params }: { params: { studentId: string } }) {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.studentId;
    if (!id) return;
    Promise.all([
      api.get(`/students/${id}`),
      api.get(`/scores/student/${id}`),
      api.get(`/results/student/${id}`),
    ]).then(([s, sc, r]) => {
      setStudent(s.data); setScores(sc.data); setResult(r.data);
    }).catch(() => router.push('/students'))
      .finally(() => setLoading(false));
  }, [params.studentId]);

  if (loading) return <div style={{ padding: '2rem', color: '#94a3b8', fontSize: '14px' }}>Loading student...</div>;
  if (!student) return null;

  const initials = `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/students" style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}>
          ← Back to Students
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div style={S.card}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            {initials}
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{student.first_name} {student.last_name}</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '1.25rem' }}>{student.stream_name || 'No stream assigned'}</p>

          {[
            { label: 'Admission No.', value: student.admission_number },
            { label: 'Gender', value: student.gender || '—' },
            { label: 'Date of Birth', value: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '—' },
            { label: 'Stream', value: student.stream_name || '—' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#94a3b8' }}>{item.label}</span>
              <span style={{ fontWeight: 500, color: '#0f172a' }}>{item.value}</span>
            </div>
          ))}

          <a href={`${process.env.NEXT_PUBLIC_API_URL}/pdf/student/${params.studentId}`} target="_blank" style={{ textDecoration: 'none', display: 'block', marginTop: '1.25rem' }}>
            <button style={{ ...S.btnPrimary, width: '100%' }}>Download Report Card</button>
          </a>
        </div>

        <div>
          {result && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Marks', value: result.summary.total_marks },
                { label: 'Average', value: `${result.summary.average}%` },
                { label: 'Subjects', value: result.summary.number_of_subjects },
              ].map(stat => (
                <div key={stat.label} style={{ ...S.card, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2563eb' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={S.tableWrapper}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Subject', 'Exam', 'CA', 'Total', 'Grade', 'Remark'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {scores.map(s => (
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
                {!scores.length && <tr><td colSpan={6} style={S.emptyState}>No scores recorded yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}