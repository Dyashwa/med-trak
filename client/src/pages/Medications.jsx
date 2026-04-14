import { useEffect, useState } from 'react';
import { getMedications, createMedication, updateMedication, deleteMedication } from '../api';

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Every 12 hours', 'Weekly', 'As needed'];
const EMPTY = { name: '', dosage: '', frequency: '', start_date: '', end_date: '', notes: '' };

const MED_COLORS = [
  { bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.25)', icon: '#14b8a6' },
  { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', icon: '#818cf8' },
  { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', icon: '#a78bfa' },
  { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', icon: '#60a5fa' },
  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', icon: '#fbbf24' },
];

export default function Medications() {
  const [meds, setMeds]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try { const { data } = await getMedications(); setMeds(data); }
    catch { setError('Failed to load medications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); setError(''); };
  const openEdit = (m) => {
    setForm({ name: m.name, dosage: m.dosage, frequency: m.frequency, start_date: m.start_date?.slice(0,10)||'', end_date: m.end_date?.slice(0,10)||'', notes: m.notes||'' });
    setEditingId(m.id); setShowForm(true); setError('');
  };
  const closeForm = () => { setShowForm(false); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      editingId ? await updateMedication(editingId, form) : await createMedication(form);
      closeForm(); load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteMedication(id); setMeds(p => p.filter(m => m.id !== id)); }
    catch { alert('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Sora', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Medications
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {meds.length > 0 ? `${meds.length} medication${meds.length > 1 ? 's' : ''} in your regimen` : 'Manage your medication regimen'}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add medication
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="animate-in" style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.75rem',
          boxShadow: '0 0 0 4px rgba(20,184,166,0.07), var(--shadow-lg)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--grad-primary)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Sora', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                {editingId ? 'Edit medication' : 'Add new medication'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fill in your medication details below</p>
            </div>
            <button onClick={closeForm} className="btn btn-ghost btn-sm" style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}>✕</button>
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', border: '1px solid rgba(244,63,94,0.25)', color: 'var(--danger)', fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="label">Medication name *</label>
                <input className="input" required placeholder="e.g. Metformin" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label className="label">Dosage *</label>
                <input className="input" required placeholder="e.g. 500mg" value={form.dosage} onChange={set('dosage')} />
              </div>
              <div className="form-group">
                <label className="label">Frequency *</label>
                <select className="input" required value={form.frequency} onChange={set('frequency')}>
                  <option value="">Select frequency</option>
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Notes</label>
                <input className="input" placeholder="e.g. Take with food" value={form.notes} onChange={set('notes')} />
              </div>
              <div className="form-group">
                <label className="label">Start date</label>
                <input type="date" className="input" value={form.start_date} onChange={set('start_date')} />
              </div>
              <div className="form-group">
                <label className="label">End date</label>
                <input type="date" className="input" value={form.end_date} onChange={set('end_date')} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button type="button" onClick={closeForm} className="btn btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? <><Spinner /> Saving…</> : editingId ? 'Update medication' : 'Add medication'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{ gap: '0.875rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  <div className="skeleton" style={{ height: 10, width: '40%' }} />
                </div>
              </div>
              <div className="skeleton" style={{ height: 10, width: '80%' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 99 }} />
                <div className="skeleton" style={{ height: 22, width: 90, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && meds.length === 0 && (
        <div className="card animate-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'Sora', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No medications yet</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 320, margin: '0 auto 1.5rem' }}>
            Start building your medication regimen by adding your first medication.
          </p>
          <button onClick={openAdd} className="btn btn-primary">Add your first medication</button>
        </div>
      )}

      {/* Medication grid */}
      {!loading && meds.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {meds.map((med, i) => {
            const c = MED_COLORS[i % MED_COLORS.length];
            return (
              <div key={med.id} className={`card animate-in d${Math.min(i+1,6)}`}
                style={{ cursor: 'default', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'Sora', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{med.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {med.id?.slice(0,8)}…</p>
                    </div>
                  </div>
                  <span className="badge badge-neutral">Active</span>
                </div>

                {/* Badges row */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="badge badge-info">{med.dosage}</span>
                  <span className="badge badge-neutral">{med.frequency}</span>
                  {med.start_date && <span className="badge badge-neutral">From {med.start_date.slice(0,10)}</span>}
                </div>

                {/* Notes */}
                {med.notes && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5, padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--border-default)' }}>
                    {med.notes}
                  </p>
                )}

                <div className="divider" style={{ margin: '0.875rem 0' }} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => openEdit(med)} className="btn btn-secondary btn-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(med.id)} disabled={deleting === med.id} className="btn btn-danger btn-sm">
                    {deleting === med.id ? <Spinner /> : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />;
}
