import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const NAV = [
  { to: '/',              end: true, label: 'Overview',       icon: OverviewIcon,     desc: 'Dashboard & stats' },
  { to: '/medications',   end: false, label: 'Medications',   icon: MedIcon,          desc: 'Manage your meds' },
  { to: '/adherence',     end: false, label: 'Adherence',     icon: AdherenceIcon,    desc: 'Log doses' },
  { to: '/effectiveness', end: false, label: 'Effectiveness', icon: EffectIcon,       desc: 'Track how you feel' },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); navigate('/login'); };
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';
  const pageTitle = NAV.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label ?? 'MedTrack';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0c1e36 0%, #060e1c 100%)',
        borderRight: '1px solid var(--border-subtle)',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease',
      }}>

        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(20,184,166,0.35)',
              flexShrink: 0,
            }}>
              <PulseIcon />
            </div>
            <div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>MedTrack</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Health Dashboard</div>
            </div>
          </div>
        </div>

        {/* Nav section label */}
        <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Sora' }}>Navigation</span>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {NAV.map(({ to, end, label, icon: Icon, desc }) => (
            <NavLink
              key={to} to={to} end={end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(99,102,241,0.12) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(20,184,166,0.2)' : '1px solid transparent',
                color: isActive ? 'var(--teal-400)' : 'var(--text-secondary)',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ display: 'flex', opacity: isActive ? 1 : 0.6, flexShrink: 0 }}><Icon /></span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, fontFamily: 'Sora', lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: '0.68rem', color: isActive ? 'rgba(45,212,191,0.6)' : 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                  </div>
                  {isActive && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-400)', boxShadow: '0 0 8px var(--teal-400)', flexShrink: 0 }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* User card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.625rem 0.75rem',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(20,184,166,0.3) 0%, rgba(99,102,241,0.3) 100%)',
              border: '1px solid rgba(20,184,166,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'var(--teal-400)',
              fontFamily: 'Sora', flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Sora', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email?.split('@')[0]}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <SignOutIcon /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top bar */}
        <header style={{
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.75rem',
          background: 'rgba(6,14,28,0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'none' }}
          >☰</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 2, height: 20, borderRadius: 99, background: 'var(--grad-primary)' }} />
            <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{pageTitle}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              background: 'var(--success-bg)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 99,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--success)', fontFamily: 'Sora' }}>System online</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem 1.75rem', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @media (max-width: 768px) {
          aside { transform: translateX(-100%); }
          div[style*='marginLeft: 240'] { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Icons ── */
function PulseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function OverviewIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function MedIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>;
}
function AdherenceIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
}
function EffectIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function SignOutIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
