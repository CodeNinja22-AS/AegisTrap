import { useState, useEffect } from "react";
import { GlassContainer } from "./ui/GlassContainer";
import { Settings as SettingsIcon, Shield, User, Mail, Clock, Zap, Download, Database, Cpu, Activity, Info } from "lucide-react";
import { motion } from "framer-motion";

const VECTOR_MAP = {
  "SQL Injection": "sqli",
  "Cross-Site Scripting": "xss",
  "Command Injection": "command_injection",
  "Brute Force": "bruteforce",
  "JWT Token Attack": "jwt_attack",
  "API Logic Abuse": "api_abuse",
  "Path Traversal": "path_traversal",
  "File Upload Attack": "file_upload_attack",
  "DDoS Pattern": "ddos_pattern",
  "CSRF Attack": "csrf",
  "Suspicious Behavior": "suspicious"
};

export default function Settings() {
  const [mode, setMode] = useState("IDS");
  const [confidence, setConfidence] = useState("balanced");
  const [siemEnabled, setSiemEnabled] = useState(false);
  const [workMode, setWorkMode] = useState("demo");
  
  const [analystName, setAnalystName] = useState("");
  const [analystRole, setAnalystRole] = useState("Analyst");
  const [analystEmail, setAnalystEmail] = useState("");
  const [shiftTime, setShiftTime] = useState("09:00 - 17:00 (Day)");
  const [urgentAlerts, setUrgentAlerts] = useState(false);
  const [priorityVectors, setPriorityVectors] = useState([]);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${BASE_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        setAnalystEmail(data.analyst_email || "");
        setUrgentAlerts(data.automation_enabled || false);
        setAnalystRole(data.report_tier || "Analyst");
        setMode(data.mode || "IDS");
        setConfidence(data.ai_threshold || "balanced");
        setSiemEnabled(data.siem_enabled || false);
        setAnalystName(data.analyst_name || "");
        setWorkMode(data.work_mode || "demo");
        setShiftTime(data.shift_time || "09:00 - 17:00 (Day)");
        
        const savedVectors = [];
        Object.entries(VECTOR_MAP).forEach(([display, key]) => {
          if (data.priority_attacks?.includes(key) && !savedVectors.includes(display)) {
            savedVectors.push(display);
          }
        });
        setPriorityVectors(savedVectors);
      })
      .catch(err => console.error("Failed to load backend settings:", err));

    setAnalystName(localStorage.getItem("aegisAnalystName") || "");
    setShiftTime(localStorage.getItem("aegisShiftTime") || "09:00 - 17:00 (Day)");
  }, []);

  const syncToBackend = (updatedFields = {}) => {
    const currentSettings = {
      analyst_email: updatedFields.analystEmail ?? analystEmail,
      automation_enabled: updatedFields.urgentAlerts ?? urgentAlerts,
      priority_attacks: (updatedFields.priorityVectors ?? priorityVectors).map(v => VECTOR_MAP[v] || "other"),
      report_tier: updatedFields.analystRole ?? analystRole,
      mode: updatedFields.mode ?? mode,
      ai_threshold: updatedFields.confidence ?? confidence,
      siem_enabled: updatedFields.siemEnabled ?? siemEnabled,
      analyst_name: updatedFields.analystName ?? analystName,
      shift_time: updatedFields.shiftTime ?? shiftTime,
      work_mode: updatedFields.workMode ?? workMode
    };

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${BASE_URL}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentSettings)
    }).catch(err => console.error("Sync failed:", err));
  };

  const handleTextChange = (setter, key, field) => (e) => {
    const val = e.target.value;
    setter(val);
    localStorage.setItem(key, val);
    if (field) syncToBackend({ [field]: val });
  };

  const handleVectorToggle = (vector) => {
    let newVectors = [...priorityVectors];
    if (newVectors.includes(vector)) {
      newVectors = newVectors.filter(v => v !== vector);
    } else {
      newVectors.push(vector);
    }
    setPriorityVectors(newVectors);
    syncToBackend({ priorityVectors: newVectors });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--text-main)] tracking-widest uppercase mb-1 flex items-center gap-3">
             System Configuration
          </h1>
          <p className="text-[var(--text-dim)] text-xs font-mono uppercase tracking-widest">
            Configure autonomous defense protocols and analyst profile.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Environment Mode Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-[var(--accent-cyber)]" />
            Operational Environment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => { setWorkMode("demo"); syncToBackend({ workMode: "demo" }); }}
              className={`p-4 rounded-lg border flex flex-col items-start gap-1 transition-all ${
                workMode === 'demo' 
                  ? 'bg-[var(--accent-cyber)]/10 border-[var(--accent-cyber)] text-[var(--accent-cyber)]' 
                  : 'bg-[var(--surface-high)]/50 border-[var(--border-color)] text-[var(--text-dim)] grayscale opacity-60'
              }`}
            >
              <span className="font-display font-bold text-sm uppercase">Demo Sandbox</span>
              <span className="text-[10px] font-mono opacity-70 italic tracking-tighter uppercase font-bold">Safe simulation & neural training mode</span>
            </button>
            <button 
              onClick={() => { setWorkMode("live"); syncToBackend({ workMode: "live" }); }}
              className={`p-4 rounded-lg border flex flex-col items-start gap-1 transition-all ${
                workMode === 'live' 
                  ? 'bg-[var(--danger)]/10 border-[var(--danger)] text-[var(--danger)]' 
                  : 'bg-[var(--surface-high)]/50 border-[var(--border-color)] text-[var(--text-dim)] grayscale opacity-60'
              }`}
            >
              <span className="font-display font-bold text-sm uppercase">Live Production</span>
              <span className="text-[10px] font-mono opacity-70 italic tracking-tighter uppercase font-bold">Active defense in neural production grid</span>
            </button>
          </div>
        </div>

        <GlassContainer className="p-8 space-y-8">
          {/* Defense Logic Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <Shield className="w-3 h-3" />
              Defense Logic & AI Protocols
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest pl-1 leading-none h-[10px]">Guard Mode</label>
                <select 
                  value={mode} 
                  onChange={(e) => { setMode(e.target.value); syncToBackend({ mode: e.target.value }); }}
                  className="w-full bg-black/40 border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-cyber)]/50"
                >
                  <option value="IDS">Passive Observation (IDS)</option>
                  <option value="IPS">Active Blocking (IPS)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest pl-1 leading-none h-[10px]">Neural Sensitivity</label>
                <select 
                  value={confidence} 
                  onChange={(e) => { setConfidence(e.target.value); syncToBackend({ confidence: e.target.value }); }}
                  className="w-full bg-black/40 border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-cyber)]/50"
                >
                  <option value="paranoid">Paranoid (Sensitive)</option>
                  <option value="balanced">Balanced (Standard)</option>
                  <option value="strict">Strict (High Confidence)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analyst Identity Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <User className="w-3 h-3" />
              Analyst Command Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest pl-1 leading-none h-[10px]">Analyst ID</label>
                <input 
                  type="text" 
                  value={analystName} 
                  onChange={handleTextChange(setAnalystName, "aegisAnalystName", "analystName")} 
                  className="w-full bg-black/40 border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-cyber)]/50"
                  placeholder="Enter alias..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest pl-1 leading-none h-[10px]">Notification Bridge</label>
                <input 
                  type="email" 
                  value={analystEmail} 
                  onChange={handleTextChange(setAnalystEmail, "aegisAnalystEmail", "analystEmail")} 
                  className="w-full bg-black/40 border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-cyber)]/50"
                  placeholder="analyst@aegis.trap"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-[var(--text-main)] uppercase tracking-[0.1em]">Compliance Evidence</p>
              <p className="text-[10px] text-[var(--text-dim)] font-mono uppercase">Last report generated 4 hours ago</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--surface-highest)] hover:bg-[var(--accent-cyber)] hover:text-black text-[var(--text-main)] text-[10px] font-bold tracking-widest uppercase transition-all border border-[var(--border-color)]">
              <Download className="w-3 h-3" />
              Download Audit JSON
            </button>
          </div>
        </GlassContainer>

        {/* Priority Vectors */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap className="w-3 h-3 text-[var(--warning)]" />
            Neural Priority Vectors
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(VECTOR_MAP).map(v => (
              <button
                key={v}
                onClick={() => handleVectorToggle(v)}
                className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest uppercase transition-all ${
                  priorityVectors.includes(v)
                    ? 'bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning)]'
                    : 'bg-[var(--surface-high)]/30 border-[var(--border-color)] text-[var(--text-dim)]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
