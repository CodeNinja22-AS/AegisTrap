import { useState, useEffect } from "react";

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
  
  // Analyst Profile States
  const [analystName, setAnalystName] = useState("");
  const [analystRole, setAnalystRole] = useState("Analyst");
  const [analystEmail, setAnalystEmail] = useState("");
  const [shiftTime, setShiftTime] = useState("09:00 - 17:00 (Day)");
  const [urgentAlerts, setUrgentAlerts] = useState(false);
  const [priorityVectors, setPriorityVectors] = useState([]);

  // Fetch from Backend on Mount
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
        
        // Map backend keys back to display names
        const savedVectors = [];
        Object.entries(VECTOR_MAP).forEach(([display, key]) => {
          if (data.priority_attacks?.includes(key) && !savedVectors.includes(display)) {
            savedVectors.push(display);
          }
        });
        setPriorityVectors(savedVectors);
      })
      .catch(err => console.error("Failed to load backend settings:", err));

    // Analyst Name and Shift (Local only)
    setAnalystName(localStorage.getItem("aegisAnalystName") || "");
    setShiftTime(localStorage.getItem("aegisShiftTime") || "09:00 - 17:00 (Day)");
  }, []);

  // Sync to Backend
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

  const handleExportReport = () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${BASE_URL}/analyst/activity`)
      .then(res => res.json())
      .then(data => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analyst_report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      })
      .catch(err => console.error("Export failed:", err));
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

  const handleUrgentAlertsToggle = () => {
    const newVal = !urgentAlerts;
    setUrgentAlerts(newVal);
    syncToBackend({ urgentAlerts: newVal });
  };


  return (
    <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem', maxWidth: '850px' }}>
      <div>
        <h1 className="glitch-text" style={{ marginBottom: '0.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          System Configuration
        </h1>
        <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          Agentic honeypot operational states and autonomous reporting.
        </p>
      </div>

      <div className="cyber-card transition-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
        
        {/* Operation Environment (IDS vs IPS) */}
        <div style={{ paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--accent-cyber)' }}>//</span> OPERATION ENVIRONMENT
          </h3>

          {/* New Work Mode Selection (Demo vs Live) */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => { setWorkMode("demo"); syncToBackend({ workMode: "demo" }); }}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: workMode === "demo" ? '2px solid var(--accent-cyber)' : '1px solid var(--border-color)',
                background: workMode === "demo" ? 'rgba(142, 255, 113, 0.1)' : 'transparent',
                color: workMode === "demo" ? 'var(--accent-cyber)' : 'var(--text-dim)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              DEMO SANDBOX
            </button>
            <button 
              onClick={() => { setWorkMode("live"); syncToBackend({ workMode: "live" }); }}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: workMode === "live" ? '2px solid var(--danger)' : '1px solid var(--border-color)',
                background: workMode === "live" ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                color: workMode === "live" ? 'var(--danger)' : 'var(--text-dim)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              LIVE PRODUCTION
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div onClick={() => { setMode("IDS"); syncToBackend({ mode: "IDS" }); }} style={{
              border: mode === "IDS" ? '1px solid var(--accent-cyber)' : '1px solid var(--border-color)',
              backgroundColor: mode === "IDS" ? 'rgba(142, 255, 113, 0.05)' : 'rgba(0,0,0,0.2)',
              padding: '1.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'
            }}>
              <h4 style={{ margin: 0, color: mode === "IDS" ? 'var(--accent-cyber)' : 'var(--text-main)' }}>Monitor (IDS Mode)</h4>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Observer + Deceive + Collect Intel</p>
            </div>
            <div onClick={() => { setMode("IPS"); syncToBackend({ mode: "IPS" }); }} style={{
              border: mode === "IPS" ? '1px solid var(--danger)' : '1px solid var(--border-color)',
              backgroundColor: mode === "IPS" ? 'rgba(255, 115, 81, 0.05)' : 'rgba(0,0,0,0.2)',
              padding: '1.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'
            }}>
              <h4 style={{ margin: 0, color: mode === "IPS" ? 'var(--danger)' : 'var(--text-main)' }}>Active Block (IPS Mode)</h4>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Intercept + Disrupt + Defend</p>
            </div>
          </div>
        </div>

        {/* SOC Configurations */}
        <div style={{ paddingBottom: '2.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--accent-cyber)' }}>//</span> ANALYST COMMAND CENTER
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Analyst Identity Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>ANALYST NAME</label>
                <input 
                  type="text" 
                  value={analystName} 
                  onChange={handleTextChange(setAnalystName, "aegisAnalystName", "analystName")} 
                  placeholder="e.g. John Doe"
                  style={{ width: '100%', margin: 0, padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>SOC ROLE (REPORT TIER)</label>
                <select 
                  className="cyber-select" 
                  value={analystRole} 
                  onChange={handleTextChange(setAnalystRole, "aegisAnalystRole", "analystRole")}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)' }}
                >
                  <option value="Tier 1">Tier 1 Analyst (Summary)</option>
                  <option value="Tier 2">Tier 2 Technical (Breakdown)</option>
                  <option value="Tier 3">Tier 3 Expert (Full Analysis)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>FORWARDING EMAIL</label>
                <input 
                  type="text" 
                  value={analystEmail} 
                  onChange={handleTextChange(setAnalystEmail, "aegisAnalystEmail", "analystEmail")} 
                  placeholder="analyst@company.com"
                  style={{ width: '100%', margin: 0, padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>SHIFT SCHEDULE</label>
                <select 
                  className="cyber-select" 
                  value={shiftTime} 
                  onChange={handleTextChange(setShiftTime, "aegisShiftTime", "shiftTime")}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)' }}
                >
                  <option value="09:00 - 17:00 (Day)">09:00 - 17:00 (Day Shift)</option>
                  <option value="17:00 - 01:00 (Evening)">17:00 - 01:00 (Evening Shift)</option>
                  <option value="01:00 - 09:00 (Night)">01:00 - 09:00 (Night Shift)</option>
                </select>
              </div>
            </div>

            {/* AI Thresholds */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>AI CONFIDENCE MODE</label>
                <select 
                  className="cyber-select" 
                  value={confidence} 
                  onChange={(e) => { setConfidence(e.target.value); syncToBackend({ confidence: e.target.value }); }}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)' }}
                >
                  <option value="paranoid">Paranoid (Sensitive)</option>
                  <option value="balanced">Balanced (Standard)</option>
                  <option value="strict">Strict (High Confidence Only)</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold' }}>SIEM Sync (Log Stream)</span>
                  <button className={`cyber-button ${siemEnabled ? 'active' : ''}`} onClick={() => { setSiemEnabled(!siemEnabled); syncToBackend({ siemEnabled: !siemEnabled }); }} style={{ padding: '0.3rem 1rem', fontSize: '0.75rem' }}>
                    {siemEnabled ? "LIVE" : "OFF"}
                  </button>
                </div>
              </div>
            </div>

            {/* Automation Toggle */}
            <div className="cyber-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '8px', border: urgentAlerts ? '1px solid var(--danger)' : '1px solid var(--border-color)' }}>
              <div>
                <div style={{ color: urgentAlerts ? 'var(--danger)' : 'var(--text-main)', fontWeight: 'bold' }}>Urgent Action Forwarding</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Autonomous SOC reports triggered by priority vectors.</div>
              </div>
              <button className={`cyber-button ${urgentAlerts ? 'active' : ''}`} onClick={handleUrgentAlertsToggle} style={{ padding: '0.5rem 1.5rem' }}>
                {urgentAlerts ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            {/* Priority Vectors */}
            <div>
              <label style={{ color: 'var(--text-main)', fontWeight: 'bold', display: 'block', marginBottom: '1rem', letterSpacing: '0.05em' }}>PRIORITY THREAT VECTORS</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {Object.keys(VECTOR_MAP).map((v) => (
                  <span 
                    key={v} 
                    onClick={() => handleVectorToggle(v)} 
                    className={`badge ${priorityVectors.includes(v) ? 'active' : ''}`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Export Evidence */}
            <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: 'rgba(142, 255, 113, 0.03)', border: '1px dashed var(--accent-cyber)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--accent-cyber)', fontWeight: 'bold', fontSize: '1rem' }}>Activity Evidence Export</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Download full activity logs and incident reports for compliance.</div>
              </div>
              <button className="cyber-button" onClick={handleExportReport} style={{ padding: '0.75rem 2rem' }}>
                EXPORT JSON
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
