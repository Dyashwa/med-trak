import { useEffect, useState } from 'react';
import { getMedications, getEffectivenessLogs, createEffectivenessLog, deleteEffectivenessLog } from '../api';
import { format, parseISO } from 'date-fns';

const RATING_CONFIG = [
  { max: 2,  label: 'Very poor',  color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
  { max: 4,  label: 'Poor',       color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  { max: 6,  label: 'Fair',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { max: 8,  label: 'Good',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  { max: 10, label: 'Excellent',  color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
];

function getRatingConfig(r) {
  return RATING_CONFIG.find(c => r <= c.max) || RATING_CONFIG.at(-1);
}

function Spinner() {
  return <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />;
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

export default function LogEffectiveness() {
  const [meds, setMeds]       = useState([]);
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ medication_id: '', rating: 7, symptoms: '', side_effects: '', notes: '', logged_at: '' });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const [m, l] = await Promise.all([getMedications(), getEffectivenessLogs()]);
      setMeds(m.data); setLogs(l.data);
      if (m.data.length) setForm(p => ({ ...p, medication_id: m.data[0].id }));
    } catch { setError('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      await createEffectivenessLog({ ...form, logged_at: form.logged_at || new Date().toISOString() });
      setSuccess('Effectiveness logged!');
      setForm(p => ({ ...p, symptoms: '', side_effects: '', notes: '', logged_at: '', rating: 7 }));
      const { data } = await getEffectivenessLogs();
      setLogs(data);
    } catch (err) { setError(err.response?.data?.error || 'Failed to log'); }
    finally { setSaving(false); setTimeout(() => setSuccess(''), 3500); }
  };

  const cfg = getRatingConfig(form.rating);
  const sliderPct = ((form.rating - 1) / 9) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div className="animate-in">
        <h1 style={{ fontFamily: 'Sora', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          Log Effectiveness
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track how your medications are working for you over time</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: Form */}
        <div className="card animate-in d1" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cfg.color}, var(--indigo-500))` }} />

          <h3 style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>How are you feeling?</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Rate this medication's effectiveness today</p>

          {error   && <Alert type="error"   msg={error}   />}
          {success && <Alert type="success" msg={success} />}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Medication */}
            <div className="form-group">
              <label className="label">Medication *</label>
              <select className="input" required value={form.medication_id} onChange={e => setForm(p => ({ ...p, medication_id: e.target.value }))}>
                <option value="">Select a medication</option>
                {meds.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* Rating slider — centrepiece */}
            <div className="form-group">
              <label className="label">Effectiveness rating *</label>
              <div style={{
                padding: '1.25rem',
                background: cfg.bg,
                border: `1px solid ${cfg.color}33`,
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.3s ease',
              }}>
                {/* Score display */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '3rem', fontWeight: 700, color: cfg.color, lineHeight: 1 }}>{form.rating}</span>
                    <span style={{ fontFamily: 'Sora', fontSize: '1rem', color: 'var(--text-muted)' }}>/10</span>
                  </div>
                  <span style={{
                    padding: '0.3rem 0.875rem', borderRadius: 99,
                    background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`,
                    color: cfg.color, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Sora',
                  }}>{cfg.label}</span>
                </div>

                {/* Slider */}
                <input
                  type="range" min="1" max="10" step="1"
                  value={form.rating}
                  onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))}
                  style={{ background: `linear-gradient(90deg, ${cfg.color} ${sliderPct}%, rgba(255,255,255,0.1) ${sliderPct}%)` }}
                />

                {/* Tick labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <span key={n} style={{
                      fontSize: '0.65rem', fontFamily: 'JetBrains Mono',
                      color: n === form.rating ? cfg.color : 'var(--text-muted)',
                      fontWeight: n === form.rating ? 700 : 400,
                      transition: 'color 0.2s',
                    }}>{n}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Symptom fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div className="form-group">
                <label className="label">Symptoms</label>
                <input className="input" placeholder="e.g. Headache, fatigue" value={form.symptoms} onChange={e => setForm(p => ({ ...p, symptoms: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Side effects</label>
                <input className="input" placeholder="e.g. Nausea, dizziness" value={form.side_effects} onChange={e => setForm(p => ({ ...p, side_effects: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Notes</label>
              <input className="input" placeholder="Any additional observations" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="label">Date & time <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>(defaults to now)</span></label>
              <input type="datetime-local" className="input" value={form.logged_at} onChange={e => setForm(p => ({ ...p, logged_at: e.target.value }))} />
            </div>

            <button type="submit" disabled={saving || !form.medication_id} className="btn btn-primary">
              {saving ? <><Spinner /> Logging…</> : 'Log effectiveness'}
            </button>
          </form>
        </div>

        {/* Right: History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="animate-in d2" style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Effectiveness history
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{logs.length} entries</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-lg)' }} />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>❤️</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No logs yet. Rate how you're feeling above.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 600, overflowY: 'auto' }}>
              {logs.slice(0, 30).map((log, i) => {
                const c = getRatingConfig(log.rating);
                return (
                  <div key={log.id} className={`log-item animate-in d${Math.min(i+2,6)}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      {/* Rating ring */}
                      <div style={{
                        width: 42, height: 42,
                        borderRadius: '50%',
                        background: c.bg,
                        border: `2px solid ${c.color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 0 12px ${c.color}22`,
                      }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.875rem', fontWeight: 700, color: c.color }}>{log.rating}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Sora' }}>{log.medication_name}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: c.color, background: c.bg, padding: '0.1rem 0.45rem', borderRadius: 99, border: `1px solid ${c.color}33` }}>{c.label}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {log.logged_at ? format(parseISO(log.logged_at), 'MMM d, yyyy · h:mm a') : '—'}
                          {log.symptoms     && <span style={{ marginLeft: '0.4rem', color: 'var(--text-secondary)' }}>· {log.symptoms}</span>}
                          {log.side_effects && <span style={{ marginLeft: '0.4rem', color: 'var(--warning)' }}>· ⚠ {log.side_effects}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEffectivenessLog(log.id).then(() => setLogs(p => p.filter(l => l.id !== log.id)))}
                      className="btn btn-ghost btn-sm"
                      style={{ flexShrink: 0, opacity: 0.5 }}
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
