'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Table from '@/components/Table';

export default function StreamsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => { const res = await api.get('/streams'); setStreams(res.data); };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name) return toast.error('Stream name is required');
    setLoading(true);
    try {
      if (editId) { await api.put(`/streams/${editId}`, { name, description }); toast.success('Stream updated!'); }
      else { await api.post('/streams', { name, description }); toast.success('Stream created!'); }
      setName(''); setDescription(''); setEditId(null); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Something went wrong'); }
    setLoading(false);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this stream?')) return;
    await api.delete(`/streams/${id}`); toast.success('Stream deleted'); load();
  };

  const inp = (val: string, set: any, placeholder: string, flex = 1) => (
    <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder} style={{
      padding: '0.65rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0',
      flex, fontSize: '14px', outline: 'none', transition: 'border 0.15s',
      fontFamily: 'inherit', background: '#fff'
    }} onFocus={e => e.target.style.border = '1.5px solid #3b82f6'}
      onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'} />
  );

  return (
    <div>
      <PageHeader title="Class Streams" subtitle="Create and manage your school's class streams" />
      <Card style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          {editId ? '✏️ Edit Stream' : '➕ New Stream'}
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {inp(name, setName, 'Stream name e.g. Form 1A')}
          {inp(description, setDescription, 'Description (optional)', 2)}
          <button onClick={submit} disabled={loading} style={{
            padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>{loading ? 'Saving...' : editId ? 'Update' : 'Add Stream'}</button>
          {editId && <button onClick={() => { setEditId(null); setName(''); setDescription(''); }} style={{
            padding: '0.65rem 1rem', background: '#f1f5f9', color: '#64748b',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize: '14px'
          }}>Cancel</button>}
        </div>
      </Card>

      <Table headers={['Stream Name', 'Description', 'Created', 'Actions']} empty={!streams.length}>
        {streams.map((s, i) => (
          <tr key={s.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
            <td style={{ padding: '1rem 1.25rem' }}>
              <span style={{ fontWeight: 600, color: '#0f172a', background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '13px' }}>{s.name}</span>
            </td>
            <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '14px' }}>{s.description || '—'}</td>
            <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '13px' }}>{new Date(s.created_at).toLocaleDateString()}</td>
            <td style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditId(s.id); setName(s.name); setDescription(s.description || ''); }} style={{ padding: '0.4rem 0.875rem', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Edit</button>
                <button onClick={() => remove(s.id)} style={{ padding: '0.4rem 0.875rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}