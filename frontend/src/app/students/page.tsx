'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import * as S from '@/lib/styles';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [filterStream, setFilterStream] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [s, st] = await Promise.all([api.get('/students'), api.get('/streams')]);
    setStudents(s.data); setStreams(st.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = filterStream ? students.filter(s => String(s.stream_id) === filterStream) : students;
  const f = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.admission_number) return toast.error('Name and admission number required');
    setLoading(true);
    try {
      if (editId) { await api.put(`/students/${editId}`, form); toast.success('Student updated'); }
      else { await api.post('/students', form); toast.success('Student registered'); }
      setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' });
      setEditId(null); setShowForm(false); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Error'); }
    setLoading(false);
  };

  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/students/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Could not delete'); }
  };

  const startEdit = (s: any) => {
    setEditId(s.id);
    setForm({ first_name: s.first_name, last_name: s.last_name, admission_number: s.admission_number, gender: s.gender || '', date_of_birth: s.date_of_birth?.split('T')[0] || '', stream_id: s.stream_id || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Students</h1>
          <p style={{ color: '#94a3b8', marginTop: '3px', fontSize: '13px' }}>Manage student registrations</p>
        </div>
        <button style={S.btnPrimary} onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' }); }}>
          {showForm ? 'Close' : '+ Register Student'}
        </button>
      </div>

      {showForm && (
        <div style={{ ...S.card, marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
            {editId ? 'Edit Student' : 'Register New Student'}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <div style={S.formGroup}><label style={S.label}>First Name</label><input style={S.input} value={form.first_name} onChange={e => f('first_name', e.target.value)} placeholder="First name" /></div>
            <div style={S.formGroup}><label style={S.label}>Last Name</label><input style={S.input} value={form.last_name} onChange={e => f('last_name', e.target.value)} placeholder="Last name" /></div>
            <div style={S.formGroup}><label style={S.label}>Admission No.</label><input style={S.input} value={form.admission_number} onChange={e => f('admission_number', e.target.value)} placeholder="ADM001" /></div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={S.formGroup}>
              <label style={S.label}>Gender</label>
              <select style={S.select} value={form.gender} onChange={e => f('gender', e.target.value)}>
                <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option>
              </select>
            </div>
            <div style={S.formGroup}><label style={S.label}>Date of Birth</label><input type="date" style={S.input} value={form.date_of_birth} onChange={e => f('date_of_birth', e.target.value)} /></div>
            <div style={S.formGroup}>
              <label style={S.label}>Stream</label>
              <select style={S.select} value={form.stream_id} onChange={e => f('stream_id', e.target.value)}>
                <option value="">Select stream...</option>
                {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={S.btnPrimary} onClick={submit} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update' : 'Register'}</button>
            <button style={S.btnGhost} onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <select style={{ ...S.select, maxWidth: '220px', width: 'auto' }} value={filterStream} onChange={e => setFilterStream(e.target.value)}>
          <option value="">All Streams</option>
          {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={S.tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Admission No.', 'Full Name', 'Gender', 'Stream', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                <td style={S.td}><span style={S.badge('blue')}>{s.admission_number}</span></td>
                <td style={{ ...S.td, fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                <td style={{ ...S.td, color: '#64748b' }}>{s.gender || '—'}</td>
                <td style={S.td}>{s.stream_name ? <span style={S.badge('purple')}>{s.stream_name}</span> : <span style={{ color: '#94a3b8' }}>—</span>}</td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link href={`/students/detail/${s.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ ...S.btnEdit, background: '#eff6ff', color: '#2563eb' }}>View</button>
                    </Link>
                    <button style={S.btnEdit} onClick={() => startEdit(s)}>Edit</button>
                    <button style={S.btnDanger} onClick={() => remove(s.id, `${s.first_name} ${s.last_name}`)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={5} style={S.emptyState}>No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}