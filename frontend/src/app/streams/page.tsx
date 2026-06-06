'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import * as S from '@/lib/styles';

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

  const remove = async (id: number, sname: string) => {
    if (!confirm(`Delete "${sname}"?`)) return;
    try { await api.delete(`/streams/${id}`); toast.success('Deleted'); load(); }
    catch (e: any) { toast.error('Could not delete'); }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={S.pageHeader}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Class Streams</h1>
        <p style={{ color: '#94a3b8', marginTop: '3px', fontSize: '13px' }}>Create and manage class streams</p>
      </div>

      <div style={{ ...S.card, marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          {editId ? 'Edit Stream' : 'New Stream'}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={S.formGroup}>
            <label style={S.label}>Stream Name</label>
            <input style={S.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Form 1A" />
          </div>
          <div style={{ ...S.formGroup, flex: 2 }}>
            <label style={S.label}>Description (optional)</label>
            <input style={S.input} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={S.btnPrimary} onClick={submit} disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update' : 'Add Stream'}
            </button>
            {editId && <button style={S.btnGhost} onClick={() => { setEditId(null); setName(''); setDescription(''); }}>Cancel</button>}
          </div>
        </div>
      </div>

      <div style={S.tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Stream Name', 'Description', 'Created', 'Actions'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {streams.map(s => (
              <tr key={s.id} style={{ transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
              >
                <td style={S.td}><span style={S.badge('blue')}>{s.name}</span></td>
                <td style={{ ...S.td, color: '#64748b' }}>{s.description || '—'}</td>
                <td style={{ ...S.td, color: '#94a3b8' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={S.btnEdit} onClick={() => { setEditId(s.id); setName(s.name); setDescription(s.description || ''); }}>Edit</button>
                    <button style={S.btnDanger} onClick={() => remove(s.id, s.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!streams.length && <tr><td colSpan={4} style={S.emptyState}>No streams yet. Add your first stream above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}