'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [filterStream, setFilterStream] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [s, st] = await Promise.all([api.get('/students'), api.get('/streams')]);
    setStudents(s.data); setStreams(st.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = filterStream ? students.filter(s => String(s.stream_id) === filterStream) : students;

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.admission_number) return toast.error('First name, last name and admission number are required');
    setLoading(true);
    try {
      if (editId) { await api.put(`/students/${editId}`, form); toast.success('Student updated'); }
      else { await api.post('/students', form); toast.success('Student registered'); }
      setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' });
      setEditId(null); setShowForm(false); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Something went wrong'); }
    setLoading(false);
  };

  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete student "${name}"?`)) return;
    try { await api.delete(`/students/${id}`); toast.success('Student deleted'); load(); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Could not delete'); }
  };

  const startEdit = (s: any) => {
    setEditId(s.id);
    setForm({ first_name: s.first_name, last_name: s.last_name, admission_number: s.admission_number, gender: s.gender || '', date_of_birth: s.date_of_birth?.split('T')[0] || '', stream_id: s.stream_id || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Students</h1>
          <p>Manage student registrations and assignments</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', stream_id: '' }); }}>
          {showForm ? 'Close Form' : 'Register Student'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {editId ? 'Edit Student' : 'Register New Student'}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="First name" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" />
            </div>
            <div className="form-group">
              <label>Admission Number</label>
              <input value={form.admission_number} onChange={e => setForm({ ...form, admission_number: e.target.value })} placeholder="e.g. ADM001" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Class Stream</label>
              <select value={form.stream_id} onChange={e => setForm({ ...form, stream_id: e.target.value })}>
                <option value="">Select stream</option>
                {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update Student' : 'Register'}</button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <select value={filterStream} onChange={e => setFilterStream(e.target.value)} style={{ maxWidth: '220px' }}>
            <option value="">All Streams</option>
            {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Admission No.</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Stream</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><span className="badge badge-blue">{s.admission_number}</span></td>
                <td style={{ fontWeight: 500 }}>{s.first_name} {s.last_name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.gender || '—'}</td>
                <td>{s.stream_name ? <span className="badge badge-purple">{s.stream_name}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/students/${s.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '4px 12px', fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>View</button>
                    </Link>
                    <button className="btn-edit" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => startEdit(s)}>Edit</button>
                    <button className="btn-danger" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => remove(s.id, `${s.first_name} ${s.last_name}`)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={5}><div className="empty-state"><p>No students found.</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}