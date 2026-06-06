'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

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
    if (classFilter.stream_id && classFilter.subject_id) {
      api.get(`/scores/stream/${classFilter.stream_id}/subject/${classFilter.subject_id}`).then(r => setClassScores(r.data));
    } else setClassScores([]);
  }, [classFilter]);

  const submit = async () => {
    if (!form.student_id || !form.subject_id) return toast.error('Select student and subject');
    setLoading(true);
    try {
      if (editId) { await api.put(`/scores/${editId}`, { exam_score: form.exam_score, ca_score: form.ca_score }); toast.success('Score updated'); }
      else { await api.post('/scores', form); toast.success('Score recorded'); }
      setEditId(null); setForm({ ...form, subject_id: '', exam_score: '', ca_score: '' });
      if (form.student_id) api.get(`/scores/student/${form.student_id}`).then(r => setScores(r.data));
    } catch (e: any) { toast.error(e.response?.data?.error || 'Something went wrong'); }
    setLoading(false);
  };

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
        <h1>Scores</h1>
        <p>Record and manage student assessment scores</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-2)', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '1.5rem' }}>
        <button style={tabStyle('individual')} onClick={() => setTab('individual')}>Individual Scores</button>
        <button style={tabStyle('class')} onClick={() => setTab('class')}>Class Performance by Subject</button>
      </div>

      {tab === 'individual' && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>Record Score</div>
            <div className="form-row">
              <div className="form-group">
                <label>Student</label>
                <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}>
                  <option value="">Select student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })}>
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Term</label>
                <select value={form.term} onChange={e => setForm({ ...form, term: e.target.value })}>
                  <option>Term 1</option><option>Term 2</option><option>Term 3</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Exam Score (0–100)</label>
                <input type="number" min={0} max={100} value={form.exam_score} onChange={e => setForm({ ...form, exam_score: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label>CA Score (0–100)</label>
                <input type="number" min={0} max={100} value={form.ca_score} onChange={e => setForm({ ...form, ca_score: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })} placeholder="2025" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update Score' : 'Record Score'}</button>
              {editId && <button className="btn-ghost" onClick={() => { setEditId(null); setForm({ ...form, subject_id: '', exam_score: '', ca_score: '' }); }}>Cancel</button>}
            </div>
          </div>

          {scores.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Subject</th><th>Exam</th><th>CA</th><th>Total</th><th>Grade</th><th>Remark</th><th>Actions</th></tr></thead>
                <tbody>
                  {scores.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.subject_name}</td>
                      <td>{s.exam_score}</td>
                      <td>{s.ca_score}</td>
                      <td style={{ fontWeight: 600 }}>{s.total_score}</td>
                      <td><span className={`badge ${gradeColor(s.grade)}`}>{s.grade}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.remark}</td>
                      <td>
                        <button className="btn-edit" style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => { setEditId(s.id); setForm({ ...form, subject_id: s.subject_id, exam_score: s.exam_score, ca_score: s.ca_score }); }}>Edit</button>
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
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>Filter by Stream and Subject</div>
            <div className="form-row">
              <div className="form-group">
                <label>Class Stream</label>
                <select value={classFilter.stream_id} onChange={e => setClassFilter({ ...classFilter, stream_id: e.target.value })}>
                  <option value="">Select stream...</option>
                  {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select value={classFilter.subject_id} onChange={e => setClassFilter({ ...classFilter, subject_id: e.target.value })}>
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {classScores.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Position</th><th>Student</th><th>Admission No.</th><th>Exam</th><th>CA</th><th>Total</th><th>Grade</th></tr></thead>
                <tbody>
                  {classScores.map((s, i) => (
                    <tr key={s.id} style={{ background: i === 0 ? 'var(--primary-light)' : '' }}>
                      <td style={{ fontWeight: 700, color: i < 3 ? 'var(--primary)' : 'var(--text-primary)' }}>#{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                      <td><span className="badge badge-blue">{s.admission_number}</span></td>
                      <td>{s.exam_score}</td>
                      <td>{s.ca_score}</td>
                      <td style={{ fontWeight: 600 }}>{s.total_score}</td>
                      <td><span className={`badge ${gradeColor(s.grade)}`}>{s.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {classFilter.stream_id && classFilter.subject_id && !classScores.length && (
            <div className="table-wrapper"><div className="empty-state"><p>No scores recorded for this stream and subject.</p></div></div>
          )}
        </>
      )}
    </div>
  );
}