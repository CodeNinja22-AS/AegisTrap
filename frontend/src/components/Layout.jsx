import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? "sidebar-link active" : "sidebar-link";
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-dark)' }}>
      {/* Sidebar Section */}
      <div className="sidebar-container" style={{ width: '250px', borderRight: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          <Link to="/" className={getLinkClass("/")} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}>
            <span style={{ fontWeight: '500' }}>Dashboard</span>
          </Link>
          <Link to="/attack" className={getLinkClass("/attack")} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}>
            <span style={{ fontWeight: '500' }}>Attack Simulator</span>
          </Link>
          <Link to="/logs" className={getLinkClass("/logs")} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}>
            <span style={{ fontWeight: '500' }}>Logs</span>
          </Link>
          <Link to="/insights" className={getLinkClass("/insights")} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}>
            <span style={{ fontWeight: '500' }}>Insights</span>
          </Link>
        </div>

        {/* Separator / Spacer for Bottom Navigation */}
        <div style={{ flex: 1 }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem', marginTop: 'auto' }}>
          <Link to="/settings" className={getLinkClass("/settings")} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight: '500' }}>Settings</span>
          </Link>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar Section */}
        <div className="topbar-container" style={{ 
          height: '70px', 
          borderBottom: '1px solid var(--border-color)', 
          background: 'var(--card-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '0.05em' }}>
              Aegis<span style={{ color: 'var(--accent-cyber)' }}>Trap</span>
            </h1>
          </div>
          
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="status-dot"></span>
              <span style={{ color: 'var(--accent-cyber)', fontWeight: '600', fontSize: '0.875rem', letterSpacing: '0.05em' }}>SYSTEM ACTIVE</span>
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </div>

        {/* Dynamic Route Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
