'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [assignStreamId, setAssignStreamId] = useState('');
  const [assignSubjectId, setAssignSubjectId] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [s, st] = await Promise.all([api.get('/subjects'), api.get('/streams')]);
    setSubjects(s.data); setStreams(st.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name || !code) return toast.error('Name and code are required');
    setLoading(true);
    try {
      if (editId) { await api.put(`/subjects/${editId}`, { name, code }); toast.success('Subject updated'); }
      else { await api.post('/subjects', { name, code }); toast.success('Subject created'); }
      setName(''); setCode(''); setEditId(null); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Something went wrong'); }
    setLoading(false);
  };

  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete subject "${name}"?`)) return;
    try { await api.delete(`/subjects/${id}`); toast.success('Subject deleted'); load(); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Could not delete'); }
  };

  const assign = async () => {
    if (!assignStreamId || !assignSubjectId) return toast.error('Select both stream and subject');
    try { await api.post('/subjects/assign', { stream_id: assignStreamId, subject_id: assignSubjectId }); toast.success('Subject assigned to stream'); setAssignStreamId(''); setAssignSubjectId(''); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Already assigned or error'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Subjects</h1>
        <p>Manage subjects and assign them to class streams</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {editId ? 'Edit Subject' : 'New Subject'}
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Subject Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mathematics" />
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Subject Code</label>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. MATH" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update' : 'Add Subject'}</button>
            {editId && <button className="btn-ghost" onClick={() => { setEditId(null); setName(''); setCode(''); }}>Cancel</button>}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Assign Subject to Stream</div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Select Stream</label>
            <select value={assignStreamId} onChange={e => setAssignStreamId(e.target.value)}>
              <option value="">Choose stream...</option>
              {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Select Subject</label>
            <select value={assignSubjectId} onChange={e => setAssignSubjectId(e.target.value)}>
              <option value="">Choose subject...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={assign}>Assign</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Code</th><th>Subject Name</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id}>
                <td><span className="badge badge-blue">{s.code}</span></td>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-edit" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => { setEditId(s.id); setName(s.name); setCode(s.code); }}>Edit</button>
                    <button className="btn-danger" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => remove(s.id, s.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!subjects.length && (
              <tr><td colSpan={4}><div className="empty-state"><p>No subjects yet.</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}