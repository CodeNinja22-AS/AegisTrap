import React from 'react';
import { GlassContainer } from './ui/GlassContainer';
import { ThreatRadar } from './ui/ThreatRadar';
import { AgenticTerminal } from './ui/AgenticTerminal';
import { LiveThreatFeed } from './ui/LiveThreatFeed';
import { useWebSocketData } from '../context/WebSocketContext';
import { ShieldAlert, Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { liveThreats, isConnected, breachMode } = useWebSocketData();

  const totalThreats = liveThreats.length;
  const criticalThreats = liveThreats.filter(t => ['sqli', 'ssrf_aws', 'k8s_attack', 'command_injection'].includes(t.attack_type)).length;
  const lastLog = liveThreats[0] || null;

  return (
    <div className={`space-y-6 ${breachMode ? 'animate-[shake_0.5s_infinite] mix-blend-color-dodge' : ''}`}>
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassContainer hoverable delay={0.1} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary)]/10 rounded-lg">
              <Activity className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[var(--text-dim)] font-display text-sm tracking-wide uppercase">Total Intercepts</p>
              <p className="text-3xl font-bold font-mono text-[var(--text-main)]">{totalThreats}</p>
            </div>
          </div>
        </GlassContainer>

        <GlassContainer hoverable delay={0.2} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--danger)]/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-[var(--danger)]" />
            </div>
            <div>
              <p className="text-[var(--text-dim)] font-display text-sm tracking-wide uppercase">Critical Threats</p>
              <p className="text-3xl font-bold font-mono text-[var(--danger)]">{criticalThreats}</p>
            </div>
          </div>
        </GlassContainer>

        <GlassContainer hoverable delay={0.3} className="p-6 relative overflow-hidden">
          {breachMode && (
             <div className="absolute inset-0 bg-red-500/20 blur-xl animate-pulse" />
          )}
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-fuchsia-500/10 rounded-lg">
              <Cpu className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-[var(--text-dim)] font-display text-sm tracking-wide uppercase">AI Instability</p>
              <p className="text-3xl font-bold font-mono text-fuchsia-400">
                {lastLog && lastLog.metadata ? (lastLog.metadata.instability * 100).toFixed(0) : 50}%
              </p>
            </div>
          </div>
        </GlassContainer>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Radar (Span 5 for more focus) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-5 h-full"
        >
          <ThreatRadar threats={liveThreats} />
        </motion.div>

        {/* Right Column: Feed and Terminal (Span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <GlassContainer delay={0.5} className="p-5 flex-1 overflow-hidden min-h-[300px]">
            <LiveThreatFeed threats={liveThreats} />
          </GlassContainer>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-[280px]"
          >
            <AgenticTerminal log={lastLog} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
