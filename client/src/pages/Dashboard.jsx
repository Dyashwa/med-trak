import { useEffect, useState } from 'react';
import { getMedications, getAdherenceSummary, getEffectivenessTrend } from '../api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';

/* ── Skeleton placeholders ── */
function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: 14, width: '50%' }} />
      <div className="skeleton" style={{ height: 36, width: '65%' }} />
      <div className="skeleton" style={{ height: 10, width: '40%' }} />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="card" style={{ height: 280 }}>
      <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: '1.25rem' }} />
      <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
    </div>
  );
}

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-overlay)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '0.6rem 0.875rem',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'Sora',
    }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--teal-400)' }}>
        {payload[0].value}{unit}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const [meds, setMeds]       = useState([]);
  const [summary, setSummary] = useState([]);
  const [trend, setTrend]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMedications(), getAdherenceSummary(), getEffectivenessTrend()])
      .then(([m, s, t]) => {
        setMeds(m.data);
        setSummary(s.data);
        setTrend(t.data.map(d => ({
          ...d,
          week: format(parseISO(d.week), 'MMM d'),
          avg_rating: parseFloat(d.avg_rating),
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const overallAdherence = summary.length
    ? Math.round(summary.reduce((a, s) => a + parseFloat(s.adherence_percentage || 0), 0) / summary.length)
    : 0;
  const totalTaken   = summary.reduce((a, s) => a + parseInt(s.taken_count   || 0), 0);
  const totalSkipped = summary.reduce((a, s) => a + parseInt(s.skipped_count || 0), 0);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  const adherenceColor = pct =>
    pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

  const STATS = [
    {
      label: 'Active Medications', value: meds.length, unit: 'tracked',
      icon: <MedIcon />, color: 'var(--teal-400)', bg: 'rgba(20,184,166,0.12)',
      border: 'rgba(20,184,166,0.2)',
    },
    {
      label: 'Overall Adherence', value: `${overallAdherence}%`, unit: 'average rate',
      icon: <AdherenceIcon />,
      color: adherenceColor(overallAdherence),
      bg: overallAdherence >= 80 ? 'var(--success-bg)' : overallAdherence >= 50 ? 'var(--warning-bg)' : 'var(--danger-bg)',
      border: overallAdherence >= 80 ? 'rgba(16,185,129,0.25)' : overallAdherence >= 50 ? 'rgba(245,158,11,0.25)' : 'rgba(244,63,94,0.25)',
    },
    {
      label: 'Doses Taken', value: totalTaken, unit: 'all time',
      icon: <CheckIcon />, color: 'var(--success)', bg: 'var(--success-bg)', border: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'Doses Skipped', value: totalSkipped, unit: 'all time',
      icon: <SkipIcon />, color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'rgba(244,63,94,0.2)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero banner */}
      <div className="animate-in" style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(99,102,241,0.12) 50%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2xl)', padding: '2rem',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal-400)', boxShadow: '0 0 10px var(--teal-400)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--teal-400)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Sora' }}>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            {greeting} 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 480 }}>
            Here's your health overview for today. Stay consistent with your medications to improve outcomes.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : STATS.map(({ label, value, unit, icon, color, bg, border }, i) => (
            <div key={label} className={`card animate-in d${i + 1}`} style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  {icon}
                </div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, marginTop: 4, boxShadow: `0 0 8px ${color}` }} />
              </div>
              <div style={{ fontFamily: 'Sora', fontSize: '1.9rem', fontWeight: 700, color, lineHeight: 1, marginBottom: '0.3rem' }}>
                {value}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem', fontFamily: 'Sora' }}>
                {label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{unit}</div>
            </div>
          ))
        }
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {loading ? (
          <><SkeletonChart /><SkeletonChart /></>
        ) : (
          <>
            {/* Adherence bar chart */}
            <div className="card animate-in d3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                    Adherence by Medication
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Percentage of doses taken</p>
                </div>
                <span className="badge badge-info">Live</span>
              </div>
              {summary.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={summary} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="barWarn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="medication_name" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Sora' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Sora' }} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip unit="%" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="adherence_percentage" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {summary.map((e, i) => (
                        <Cell key={i} fill={parseFloat(e.adherence_percentage) >= 80 ? 'url(#barGood)' : 'url(#barWarn)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Effectiveness area chart */}
            <div className="card animate-in d4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                    Effectiveness Trend
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly average rating (1–10)</p>
                </div>
                <span className="badge badge-success">Trending</span>
              </div>
              {trend.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={trend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Sora' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Sora' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip unit="/10" />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="avg_rating" stroke="var(--teal-400)" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: 'var(--teal-400)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: 'var(--teal-300)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>

      {/* Medication table */}
      <div className="card animate-in d5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Sora', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Active Medications
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{meds.length} total</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 58 }} />)}
          </div>
        ) : meds.length === 0 ? (
          <div className="empty-state">
            <EmptyMedIcon />
            <p>No medications added yet.<br />Go to Medications to add your first one.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {meds.map((med, i) => {
              const s = summary.find(s => s.medication_id === med.id);
              const pct = s ? parseFloat(s.adherence_percentage) : null;
              return (
                <div key={med.id} className="log-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(99,102,241,0.12) 100%)',
                      border: '1px solid rgba(20,184,166,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Sora', marginBottom: 3 }}>{med.name}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-neutral">{med.dosage}</span>
                        <span className="badge badge-neutral">{med.frequency}</span>
                      </div>
                    </div>
                  </div>
                  {pct !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1rem', fontWeight: 500, color: adherenceColor(pct) }}>{pct}%</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>adherence</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No data available yet</p>
    </div>
  );
}
function EmptyMedIcon() {
  return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>;
}
function MedIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>; }
function AdherenceIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>; }
function CheckIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function SkipIcon()      { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }
