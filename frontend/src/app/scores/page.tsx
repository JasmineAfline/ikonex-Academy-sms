'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ScoresPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [form, setForm] = useState({ student_id: '', subject_id: '', exam_score: '', ca_score: '', term: 'Term 1', academic_year: '2025' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data));
    api.get('/subjects').then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    if (form.student_id) api.get(`/scores/student/${form.student_id}`).then(r => setScores(r.data));
    else setScores([]);
  }, [form.student_id]);

  const submit = async () => {
    if (!form.student_id || !form.subject_id) return toast.error('Select student and subject');
    try {
      if (editId) {
        await api.put(`/scores/${editId}`, { exam_score: form.exam_score, ca_score: form.ca_score });
        toast.success('Score updated');
      } else {
        await api.post('/scores', form);
        toast.success('Score recorded');
      }
      setEditId(null);
      setForm({ ...form, subject_id: '', exam_score: '', ca_score: '' });
      if (form.student_id) api.get(`/scores/student/${form.student_id}`).then(r => setScores(r.data));
    } catch (e: any) { toast.error(e.response?.data?.error || 'Error'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Record Scores</h1>
      <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 2, minWidth: '200px' }}>
            <option value="">Select student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)}
          </select>
          <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 2, minWidth: '150px' }}>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input type="number" value={form.exam_score} onChange={e => setForm({ ...form, exam_score: e.target.value })}
            placeholder="Exam score (0-100)" min={0} max={100}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1 }} />
          <input type="number" value={form.ca_score} onChange={e => setForm({ ...form, ca_score: e.target.value })}
            placeholder="CA score (0-100)" min={0} max={100}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1 }} />
          <select value={form.term} onChange={e => setForm({ ...form, term: e.target.value })}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1 }}>
            <option>Term 1</option><option>Term 2</option><option>Term 3</option>
          </select>
          <button onClick={submit} style={{ padding: '0.5rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {editId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
      {scores.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>{['Subject', 'Exam', 'CA', 'Total', 'Grade', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {scores.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.subject_name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{s.exam_score}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{s.ca_score}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.total_score}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: s.grade === 'A' ? '#d1fae5' : s.grade === 'F' ? '#fee2e2' : '#fef3c7', color: s.grade === 'A' ? '#065f46' : s.grade === 'F' ? '#991b1b' : '#92400e', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>{s.grade}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => { setEditId(s.id); setForm({ ...form, subject_id: s.subject_id, exam_score: s.exam_score, ca_score: s.ca_score }); }}
                      style={{ padding: '0.3rem 0.8rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}