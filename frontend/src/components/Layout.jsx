import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Terminal, BarChart2, Settings, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWebSocketData } from '../context/WebSocketContext';

export default function Layout({ children }) {
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const { breachMode, toggleBreachMode } = useWebSocketData();

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--surface-highest)] text-[var(--accent-cyber)] border-r-2 border-[var(--accent-cyber)] transition-all"
      : "flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-dim)] hover:bg-[var(--surface-highest)] hover:text-[var(--text-main)] transition-all";
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[var(--bg-dark)] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-[var(--border-color)] bg-[var(--surface-low)] py-8 flex flex-col z-20"
      >
        <div className="px-6 mb-8 flex items-center gap-2">
          <Shield className="text-[var(--accent-cyber)] w-8 h-8" />
          <h1 className="font-display font-bold text-2xl tracking-wider text-[var(--text-main)] m-0 pb-0 border-none">
            Aegis<span className="text-[var(--accent-cyber)]">Trap</span>
          </h1>
        </div>

        <div className="flex flex-col gap-2 px-4 flex-1">
          <Link to="/" className={getLinkClass("/")}>
            <Activity className="w-5 h-5" />
            <span className="font-medium tracking-wide">Dashboard</span>
          </Link>
          <Link to="/attack" className={getLinkClass("/attack")}>
            <Crosshair className="w-5 h-5" />
            <span className="font-medium tracking-wide">Simulator</span>
          </Link>
          <Link to="/logs" className={getLinkClass("/logs")}>
            <Terminal className="w-5 h-5" />
            <span className="font-medium tracking-wide">Live Logs</span>
          </Link>
          <Link to="/insights" className={getLinkClass("/insights")}>
            <BarChart2 className="w-5 h-5" />
            <span className="font-medium tracking-wide">Insights</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2 px-4 mt-auto">
          <div className="h-px w-full bg-[var(--border-color)] mb-2" />
          <Link to="/settings" className={getLinkClass("/settings")}>
            <Settings className="w-5 h-5" />
            <span className="font-medium tracking-wide">Settings</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-[70px] border-b border-[var(--border-color)] bg-[var(--surface-low)]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-[var(--primary-container)]/10 border border-[var(--accent-cyber)]/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyber)] animate-pulse shadow-[0_0_8px_var(--accent-cyber)]" />
              <span className="text-[var(--accent-cyber)] font-display text-xs font-bold tracking-widest">A.I. SENTINEL ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleBreachMode}
              className={`px-4 py-1.5 rounded border text-xs font-display font-bold tracking-widest transition-all ${
                breachMode 
                  ? 'bg-[var(--danger)] text-black border-[var(--danger)] shadow-[0_0_15px_var(--danger)] animate-pulse'
                  : 'bg-[var(--danger)]/10 border-[var(--danger)]/50 text-[var(--danger)] hover:bg-[var(--danger)]/20'
              }`}
            >
              BREACH TEST
            </button>
            <div className="text-[var(--text-dim)] font-mono text-sm tracking-widest bg-[var(--surface-high)] px-4 py-2 rounded-md border border-[var(--border-color)]">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto px-12 py-10 relative">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
