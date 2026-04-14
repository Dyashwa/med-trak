import { useEffect, useState } from 'react';
import { getMedications, getAdherenceLogs, createAdherenceLog, deleteAdherenceLog } from '../api';
import { format, parseISO } from 'date-fns';

const STATUS_OPTIONS = [
  {
    value: 'taken', label: 'Taken', emoji: '✓',
    color: 'var(--success)', bg: 'var(--success-bg)', border: 'rgba(16,185,129,0.3)',
    desc: 'Dose taken on time',
  },
  {
    value: 'skipped', label: 'Skipped', emoji: '✕',
    color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'rgba(244,63,94,0.3)',
    desc: 'Dose was not taken',
  },
  {
    value: 'late', label: 'Late', emoji: '~',
    color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'rgba(245,158,11,0.3)',
    desc: 'Taken outside schedule',
  },
];

function Spinner() {
  return <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />;
}

export default function LogAdherence() {
  const [meds, setMeds]       = useState([]);
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ medication_id: '', status: 'taken', taken_at: '', notes: '' });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const [m, l] = await Promise.all([getMedications(), getAdherenceLogs()]);
      setMeds(m.data);
      setLogs(l.data);
      if (m.data.length) setForm(p => ({ ...p, medication_id: m.data[0].id }));
    } catch { setError('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      await createAdherenceLog({ ...form, taken_at: form.taken_at || new Date().toISOString() });
      setSuccess('Dose logged successfully!');
      setForm(p => ({ ...p, taken_at: '', notes: '' }));
      const { data } = await getAdherenceLogs();
      setLogs(data);
    } catch (err) { setError(err.response?.data?.error || 'Failed to log'); }
    finally { setSaving(false); setTimeout(() => setSuccess(''), 3500); }
  };

  const handleDelete = async (id) => {
    try { await deleteAdherenceLog(id); setLogs(p => p.filter(l => l.id !== id)); }
    catch { alert('Failed to delete log'); }
  };

  const getStatusOption = (v) => STATUS_OPTIONS.find(s => s.value === v);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div className="animate-in">
        <h1 style={{ fontFamily: 'Sora', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          Log Adherence
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Record whether you took your medication doses</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: Form */}
        <div className="card animate-in d1" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--grad-primary)' }} />

          <h3 style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Record a dose</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Log today's medication status</p>

          {error   && <Alert type="error"   msg={error}   />}
          {success && <Alert type="success" msg={success} />}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Medication select */}
            <div className="form-group">
              <label className="label">Medication *</label>
              <select className="input" required value={form.medication_id} onChange={e => setForm(p => ({ ...p, medication_id: e.target.value }))}>
                <option value="">Select a medication</option>
                {meds.map(m => <option key={m.id} value={m.id}>{m.name} — {m.dosage}</option>)}
              </select>
            </div>

            {/* Status buttons */}
            <div className="form-group">
              <label className="label">Status *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {STATUS_OPTIONS.map(({ value, label, emoji, color, bg, border, desc }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setForm(p => ({ ...p, status: value }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${form.status === value ? border : 'var(--border-subtle)'}`,
                      background: form.status === value ? bg : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      transform: form.status === value ? 'scale(1.01)' : 'scale(1)',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: form.status === value ? `${color}22` : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${form.status === value ? color : 'var(--border-subtle)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: form.status === value ? color : 'var(--text-muted)',
                      flexShrink: 0, fontFamily: 'Sora',
                    }}>{emoji}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: form.status === value ? color : 'var(--text-secondary)', fontFamily: 'Sora' }}>{label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                    {form.status === value && (
                      <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Date/time */}
            <div className="form-group">
              <label className="label">Date & time <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>(defaults to now)</span></label>
              <input type="datetime-local" className="input" value={form.taken_at} onChange={e => setForm(p => ({ ...p, taken_at: e.target.value }))} />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="label">Notes</label>
              <input className="input" placeholder="e.g. Took with breakfast" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <button type="submit" disabled={saving || !form.medication_id} className="btn btn-primary" style={{ marginTop: '0.25rem' }}>
              {saving ? <><Spinner /> Logging…</> : 'Log dose'}
            </button>
          </form>
        </div>

        {/* Right: Log history */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="animate-in d2" style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent doses
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{logs.length} entries</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 68, borderRadius: 'var(--radius-lg)' }} />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>💊</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No logs yet. Record your first dose.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 580, overflowY: 'auto' }}>
              {logs.slice(0, 30).map((log, i) => {
                const s = getStatusOption(log.status);
                return (
                  <div key={log.id} className={`log-item animate-in d${Math.min(i+2,6)}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: s?.bg, border: `1px solid ${s?.border || 'transparent'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, color: s?.color,
                        fontFamily: 'Sora', flexShrink: 0,
                      }}>{s?.emoji}</div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Sora', marginBottom: 2 }}>
                          {log.medication_name}
                          <span style={{ marginLeft: '0.4rem' }}><span className={`badge badge-${log.status === 'taken' ? 'success' : log.status === 'skipped' ? 'danger' : 'warning'}`}>{s?.label}</span></span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {log.taken_at ? format(parseISO(log.taken_at), 'MMM d, yyyy · h:mm a') : '—'}
                          {log.notes && <span style={{ marginLeft: '0.4rem', color: 'var(--text-secondary)' }}>· {log.notes}</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(log.id)} className="btn btn-ghost btn-sm" style={{ flexShrink: 0, opacity: 0.5 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Alert({ type, msg }) {
  const isError = type === 'error';
  return (
    <div style={{
      marginBottom: '1rem', padding: '0.7rem 1rem',
      borderRadius: 'var(--radius-md)',
      background: isError ? 'var(--danger-bg)' : 'var(--success-bg)',
      border: `1px solid ${isError ? 'rgba(244,63,94,0.25)' : 'rgba(16,185,129,0.25)'}`,
      color: isError ? 'var(--danger)' : 'var(--success)',
      fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      {isError ? '✕' : '✓'} {msg}
    </div>
  );
}
