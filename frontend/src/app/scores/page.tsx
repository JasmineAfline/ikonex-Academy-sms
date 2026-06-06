'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import * as S from '@/lib/styles';

export default function ScoresPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [classScores, setClassScores] = useState<any[]>([]);
  const [tab, setTab] = useState<'individual' | 'class'>('individual');
  const [form, setForm] = useState({ student_id: '', subject_id: '', exam_score: '', ca_score: '', term: 'Term 1', academic_year: '2025' });
  const [classFilter, setClassFilter] = useState({ stream_id: '', subject_id: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/subjects'), api.get('/streams')])
      .then(([s, su, st]) => { setStudents(s.data); setSubjects(su.data); setStreams(st.data); });
  }, []);

  useEffect(() => {
    if (form.student_id) api.get(`/scores/student/${form.student_id}`).then(r => setScores(r.data));
    else setScores([]);
  }, [form.student_id]);

  useEffect(() => {
    if (classFilter.stream_id && classFilter.subject_id)
      api.get(`/scores/stream/${classFilter.stream_id}/subject/${classFilter.subject_id}`).then(r => setClassScores(r.data));
    else setClassScores([]);
  }, [classFilter]);

  const submit = async () => {
    if (!form.student_id || !form.subject_id) return toast.error('Select student and subject');
    setLoading(true);
    try {
      if (editId) { await api.put(`/scores/${editId}`, { exam_score: form.exam_score, ca_score: form.ca_score }); toast.success('Score updated'); }
      else { await api.post('/scores', form); toast.success('Score recorded'); }
      setEditId(null);
      setForm(prev => ({ ...prev, subject_id: '', exam_score: '', ca_score: '' }));
      if (form.student_id) api.get(`/scores/student/${form.student_id}`).then(r => setScores(r.data));
    } catch (e: any) { toast.error(e.response?.data?.error || 'Error'); }
    setLoading(false);
  };

  const tabBtn = (t: 'individual' | 'class', label: string) => (
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
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Scores</h1>
        <p style={{ color: '#94a3b8', marginTop: '3px', fontSize: '13px' }}>Record and manage student assessment scores</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '1.5rem' }}>
        {tabBtn('individual', 'Individual Scores')}
        {tabBtn('class', 'Class Performance by Subject')}
      </div>

      {tab === 'individual' && (
        <>
          <div style={{ ...S.card, marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Record Score</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <div style={S.formGroup}>
                <label style={S.label}>Student</label>
                <select style={S.select} value={form.student_id} onChange={e => setForm(p => ({ ...p, student_id: e.target.value }))}>
                  <option value="">Select student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)}
                </select>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Subject</label>
                <select style={S.select} value={form.subject_id} onChange={e => setForm(p => ({ ...p, subject_id: e.target.value }))}>
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Term</label>
                <select style={S.select} value={form.term} onChange={e => setForm(p => ({ ...p, term: e.target.value }))}>
                  <option>Term 1</option><option>Term 2</option><option>Term 3</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={S.formGroup}>
                <label style={S.label}>Exam Score (0–100)</label>
                <input style={S.input} type="number" min={0} max={100} value={form.exam_score} onChange={e => setForm(p => ({ ...p, exam_score: e.target.value }))} placeholder="0" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>CA Score (0–100)</label>
                <input style={S.input} type="number" min={0} max={100} value={form.ca_score} onChange={e => setForm(p => ({ ...p, ca_score: e.target.value }))} placeholder="0" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Academic Year</label>
                <input style={S.input} value={form.academic_year} onChange={e => setForm(p => ({ ...p, academic_year: e.target.value }))} placeholder="2025" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={S.btnPrimary} onClick={submit} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update Score' : 'Record Score'}</button>
              {editId && <button style={S.btnGhost} onClick={() => { setEditId(null); setForm(p => ({ ...p, subject_id: '', exam_score: '', ca_score: '' })); }}>Cancel</button>}
            </div>
          </div>

          {scores.length > 0 && (
            <div style={S.tableWrapper}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Subject', 'Exam', 'CA', 'Total', 'Grade', 'Remark', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
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
                      <td style={S.td}>
                        <button style={S.btnEdit} onClick={() => { setEditId(s.id); setForm(p => ({ ...p, subject_id: s.subject_id, exam_score: s.exam_score, ca_score: s.ca_score })); }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'class' && (
        <>
          <div style={{ ...S.card, marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Filter by Stream and Subject</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={S.formGroup}>
                <label style={S.label}>Class Stream</label>
                <select style={S.select} value={classFilter.stream_id} onChange={e => setClassFilter(p => ({ ...p, stream_id: e.target.value }))}>
                  <option value="">Select stream...</option>
                  {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Subject</label>
                <select style={S.select} value={classFilter.subject_id} onChange={e => setClassFilter(p => ({ ...p, subject_id: e.target.value }))}>
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {classScores.length > 0 && (
            <div style={S.tableWrapper}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Position', 'Student', 'Admission No.', 'Exam', 'CA', 'Total', 'Grade'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {classScores.map((s, i) => (
                    <tr key={s.id}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                      <td style={S.td}><span style={{ fontWeight: 700, color: i < 3 ? '#2563eb' : '#0f172a' }}>#{i + 1}</span></td>
                      <td style={{ ...S.td, fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                      <td style={S.td}><span style={S.badge('blue')}>{s.admission_number}</span></td>
                      <td style={S.td}>{s.exam_score}</td>
                      <td style={S.td}>{s.ca_score}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{s.total_score}</td>
                      <td style={S.td}><span style={S.gradeBadge(s.grade)}>{s.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {classFilter.stream_id && classFilter.subject_id && !classScores.length && (
            <div style={S.tableWrapper}><div style={S.emptyState}>No scores for this stream and subject yet.</div></div>
          )}
        </>
      )}
    </div>
  );
}