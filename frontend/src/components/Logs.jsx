import { useEffect, useState } from "react";
import { getLogs } from "../services/api";
import { GlassContainer } from "./ui/GlassContainer";
import { Search, Filter, ShieldAlert, Cpu, Terminal, Clock, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const fetchLogs = async () => {
    try {
      const res = await getLogs();
      setLogs(res || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeverity = (type) => {
    if (['sqli', 'command_injection', 'ddos_pattern', 'ssrf_aws', 'k8s_attack'].includes(type)) return { label: 'CRITICAL', color: 'text-[var(--danger)]', border: 'border-l-[var(--danger)]' };
    if (['xss', 'path_traversal', 'file_upload_attack', 'jwt_attack'].includes(type)) return { label: 'HIGH', color: 'text-[var(--warning)]', border: 'border-l-[var(--warning)]' };
    if (['suspicious', 'api_abuse', 'csrf'].includes(type)) return { label: 'MEDIUM', color: 'text-[var(--primary)]', border: 'border-l-[var(--primary)]' };
    return { label: 'INFO', color: 'text-[var(--text-dim)]', border: 'border-l-[var(--border-color)]' };
  };

  const filteredLogs = [...logs].reverse().filter(log => {
    const [_, payload, prediction, response] = log;
    const matchesFilter = filterType === "All" || prediction === filterType.toLowerCase().replace(' ', '_');
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      String(payload).toLowerCase().includes(searchLower) ||
      String(prediction).toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--text-main)] tracking-widest uppercase mb-1">
            Threat Intelligence Log
          </h1>
          <p className="text-[var(--text-dim)] text-xs font-mono uppercase tracking-widest">
            Historical archival of intercepted neural activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input 
              type="text" 
              placeholder="Search signatures..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--surface-high)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] font-mono outline-none focus:border-[var(--accent-cyber)]/40 transition-all w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-[var(--surface-high)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] appearance-none outline-none focus:border-[var(--accent-cyber)]/40 transition-all cursor-pointer"
            >
              <option value="All">All Entities</option>
              <option value="SQLi">SQL Injection</option>
              <option value="XSS">XSS Signatures</option>
              <option value="Command Injection">CMD Injects</option>
              <option value="Path Traversal">Directory Traversal</option>
              <option value="DDoS">DDoS Patterns</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading && logs.length === 0 ? (
            <div className="py-20 text-center">
              <Activity className="w-10 h-10 text-[var(--accent-cyber)] animate-pulse mx-auto mb-4" />
              <p className="text-[var(--text-dim)] font-mono text-sm tracking-widest uppercase">Initializing Log Stream...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl">
              <p className="text-[var(--text-dim)] font-mono text-sm tracking-widest uppercase">No interception matches current scan profile.</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const [timestamp, payload, prediction, response] = log;
              const severity = getSeverity(prediction);
              
              return (
                <motion.div
                  key={timestamp + index}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index % 5) * 0.05 }}
                >
                  <GlassContainer className={`overflow-hidden border-l-4 ${severity.border}`}>
                    <div className="flex flex-col">
                      {/* Header */}
                      <div className="px-6 py-3 bg-[var(--surface-high)]/30 border-b border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-bold tracking-widest py-1 px-2 rounded bg-black/40 ${severity.color}`}>
                            {severity.label}
                          </span>
                          <span className="text-sm font-display font-medium text-[var(--text-main)] uppercase tracking-wider">
                            {prediction.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[var(--text-dim)] text-[10px] font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(timestamp).toLocaleString()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-5 space-y-2">
                          <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest block">Ingested Payload</label>
                          <div className="bg-black/40 p-3 rounded border border-[var(--border-color)] font-mono text-xs text-[var(--primary)] break-all min-h-[50px] flex items-center">
                            {payload}
                          </div>
                        </div>

                        <div className="md:col-span-1 flex items-center justify-center opacity-20">
                          <ChevronRight className="w-6 h-6" />
                        </div>

                        <div className="md:col-span-6 space-y-2">
                          <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest block">Simulation Resolution</label>
                          <div className="bg-black/20 p-3 rounded border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-main)] leading-relaxed h-[80px] overflow-y-auto">
                            {typeof response === 'string' ? response : JSON.stringify(response)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassContainer>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
