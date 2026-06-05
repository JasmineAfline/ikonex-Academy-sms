'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [form, setForm] = useState({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' });
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    const [s, st] = await Promise.all([api.get('/students'), api.get('/streams')]);
    setStudents(s.data); setStreams(st.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.admission_number) return toast.error('Name and admission number required');
    try {
      if (editId) { await api.put(`/students/${editId}`, form); toast.success('Updated'); }
      else { await api.post('/students', form); toast.success('Student registered'); }
      setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' });
      setEditId(null); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Error'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete student?')) return;
    await api.delete(`/students/${id}`); toast.success('Deleted'); load();
  };

  const inp = (field: string, placeholder: string, type = 'text') => (
    <input type={type} value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
      placeholder={placeholder} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1, minWidth: '150px' }} />
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Students</h1>
      <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>{editId ? 'Edit Student' : 'Register Student'}</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {inp('first_name', 'First name')}
          {inp('last_name', 'Last name')}
          {inp('admission_number', 'Admission number')}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1, minWidth: '150px' }}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {inp('date_of_birth', 'Date of birth', 'date')}
          <select value={form.stream_id} onChange={e => setForm({ ...form, stream_id: e.target.value })}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1, minWidth: '150px' }}>
            <option value="">Select stream</option>
            {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={submit} style={{ padding: '0.5rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {editId ? 'Update' : 'Register'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' }); }}
            style={{ padding: '0.5rem 1rem', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>{['Admission #', 'Name', 'Gender', 'Stream', 'Actions'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{s.admission_number}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.gender || '—'}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.stream_name || '—'}</td>
                <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditId(s.id); setForm({ first_name: s.first_name, last_name: s.last_name, admission_number: s.admission_number, gender: s.gender || '', date_of_birth: s.date_of_birth?.split('T')[0] || '', stream_id: s.stream_id || '' }); }}
                    style={{ padding: '0.3rem 0.8rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => remove(s.id)}
                    style={{ padding: '0.3rem 0.8rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {!students.length && <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No students yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}