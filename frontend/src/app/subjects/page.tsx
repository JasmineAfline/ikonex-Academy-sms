'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import * as S from '@/lib/styles';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [assignStreamId, setAssignStreamId] = useState('');
  const [assignSubjectId, setAssignSubjectId] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [s, st] = await Promise.all([api.get('/subjects'), api.get('/streams')]);
      setSubjects(s.data);
      setStreams(st.data);
    } catch { toast.error('Failed to load data'); }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name || !code) return toast.error('Name and code are required');
    setSaving(true);
    try {
      if (editId) { await api.put(`/subjects/${editId}`, { name, code }); toast.success('Subject updated'); }
      else { await api.post('/subjects', { name, code }); toast.success('Subject created'); }
      setName(''); setCode(''); setEditId(null); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Error'); }
    setSaving(false);
  };

  const remove = async (id: number, n: string) => {
    if (!confirm(`Delete "${n}"?`)) return;
    try { await api.delete(`/subjects/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Could not delete'); }
  };

  const assign = async () => {
    if (!assignStreamId || !assignSubjectId) return toast.error('Select both stream and subject');
    try {
      await api.post('/subjects/assign', { stream_id: assignStreamId, subject_id: assignSubjectId });
      toast.success('Subject assigned to stream');
      setAssignStreamId(''); setAssignSubjectId('');
    } catch (e: any) { toast.error(e.response?.data?.error || 'Already assigned or error'); }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Subjects</h1>
        <p style={{ color: '#94a3b8', marginTop: '3px', fontSize: '13px' }}>Manage subjects and assign them to class streams</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={S.card}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
            {editId ? 'Edit Subject' : 'New Subject'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={S.formGroup}>
              <label style={S.label}>Subject Name</label>
              <input style={S.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mathematics" />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Subject Code</label>
              <input style={S.input} value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. MATH" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={S.btnPrimary} onClick={submit} disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Subject'}
              </button>
              {editId && <button style={S.btnGhost} onClick={() => { setEditId(null); setName(''); setCode(''); }}>Cancel</button>}
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Assign Subject to Stream</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={S.formGroup}>
              <label style={S.label}>Class Stream</label>
              <select style={S.select} value={assignStreamId} onChange={e => setAssignStreamId(e.target.value)}>
                <option value="">Select stream...</option>
                {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Subject</label>
              <select style={S.select} value={assignSubjectId} onChange={e => setAssignSubjectId(e.target.value)}>
                <option value="">Select subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button style={S.btnPrimary} onClick={assign}>Assign to Stream</button>
          </div>
        </div>
      </div>

      <div style={S.tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Code', 'Subject Name', 'Created', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                <td style={S.td}><span style={S.badge('blue')}>{s.code}</span></td>
                <td style={{ ...S.td, fontWeight: 500 }}>{s.name}</td>
                <td style={{ ...S.td, color: '#94a3b8' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={S.btnEdit} onClick={() => { setEditId(s.id); setName(s.name); setCode(s.code); }}>Edit</button>
                    <button style={S.btnDanger} onClick={() => remove(s.id, s.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!subjects.length && <tr><td colSpan={4} style={S.emptyState}>No subjects yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}