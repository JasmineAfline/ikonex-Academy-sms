'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function StreamsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => { const res = await api.get('/streams'); setStreams(res.data); };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name.trim()) return toast.error('Stream name is required');
    setLoading(true);
    try {
      if (editId) { await api.put(`/streams/${editId}`, { name, description }); toast.success('Stream updated'); }
      else { await api.post('/streams', { name, description }); toast.success('Stream created'); }
      setName(''); setDescription(''); setEditId(null); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Something went wrong'); }
    setLoading(false);
  };

  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete stream "${name}"?`)) return;
    try { await api.delete(`/streams/${id}`); toast.success('Stream deleted'); load(); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Could not delete'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Class Streams</h1>
        <p>Create and manage class streams for Ikonex Academy</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {editId ? 'Edit Stream' : 'New Stream'}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Stream Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Form 1A" />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Description (optional)</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', paddingBottom: '0' }}>
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update' : 'Add Stream'}
            </button>
            {editId && <button className="btn-ghost" onClick={() => { setEditId(null); setName(''); setDescription(''); }}>Cancel</button>}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Stream Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {streams.map(s => (
              <tr key={s.id}>
                <td><span className="badge badge-blue">{s.name}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.description || '—'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-edit" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => { setEditId(s.id); setName(s.name); setDescription(s.description || ''); }}>Edit</button>
                    <button className="btn-danger" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => remove(s.id, s.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!streams.length && (
              <tr><td colSpan={4}><div className="empty-state"><p>No class streams yet. Add your first stream above.</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}