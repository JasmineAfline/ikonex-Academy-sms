'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => { const res = await api.get('/subjects'); setSubjects(res.data); };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name || !code) return toast.error('Name and code required');
    try {
      if (editId) { await api.put(`/subjects/${editId}`, { name, code }); toast.success('Updated'); }
      else { await api.post('/subjects', { name, code }); toast.success('Subject created'); }
      setName(''); setCode(''); setEditId(null); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Error'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete subject?')) return;
    await api.delete(`/subjects/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Subjects</h1>
      <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>{editId ? 'Edit Subject' : 'Add Subject'}</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Subject name e.g. Mathematics"
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 2 }} />
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code e.g. MATH"
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1 }} />
          <button onClick={submit} style={{ padding: '0.5rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {editId ? 'Update' : 'Add'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setName(''); setCode(''); }}
            style={{ padding: '0.5rem 1rem', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>{['Code', 'Name', 'Created', 'Actions'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem 1rem' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>{s.code}</span></td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditId(s.id); setName(s.name); setCode(s.code); }}
                    style={{ padding: '0.3rem 0.8rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => remove(s.id)}
                    style={{ padding: '0.3rem 0.8rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {!subjects.length && <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No subjects yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}