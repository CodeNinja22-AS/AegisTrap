import { useEffect, useState } from "react";
import { getLogs } from "../services/api";

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
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (prediction) => {
    switch (prediction) {
      case "sqli": return "var(--danger)";
      case "xss": return "var(--warning)";
      case "bruteforce": return "var(--accent-cyber)";
      case "suspicious": return "var(--warning)";
      case "command_injection": return "var(--danger)";
      case "path_traversal": return "var(--warning)";
      case "file_upload_attack": return "var(--warning)";
      case "ddos_pattern": return "var(--danger)";
      case "csrf": return "var(--warning)";
      case "jwt_attack": return "var(--warning)";
      case "api_abuse": return "var(--warning)";
      case "normal": return "var(--text-dim)";
      default: return "var(--primary)";
    }
  };

  const getRiskBadge = (prediction) => {
    switch (prediction) {
      case "sqli": return "CRITICAL";
      case "xss": return "HIGH";
      case "bruteforce": return "HIGH";
      case "suspicious": return "MEDIUM";
      case "command_injection": return "CRITICAL";
      case "path_traversal": return "HIGH";
      case "file_upload_attack": return "HIGH";
      case "ddos_pattern": return "CRITICAL";
      case "csrf": return "MEDIUM";
      case "jwt_attack": return "HIGH";
      case "api_abuse": return "MEDIUM";
      case "normal": return "NONE";
      default: return "UNKNOWN";
    }
  };

  const filteredLogs = [...logs].reverse().filter(log => {
    const [timestamp, payload, prediction, response] = log;
    
    // Check type filter
    const matchesFilter = filterType === "All" || 
      (filterType === "SQLi" && prediction === "sqli") ||
      (filterType === "XSS" && prediction === "xss") ||
      (filterType === "Brute Force" && prediction === "bruteforce") ||
      (filterType === "Command Injection" && prediction === "command_injection") ||
      (filterType === "Path Traversal" && prediction === "path_traversal") ||
      (filterType === "File Upload" && prediction === "file_upload_attack") ||
      (filterType === "DDoS" && prediction === "ddos_pattern") ||
      (filterType === "CSRF" && prediction === "csrf") ||
      (filterType === "JWT" && prediction === "jwt_attack") ||
      (filterType === "API Abuse" && prediction === "api_abuse") ||
      (filterType === "Suspicious" && prediction === "suspicious");

    // Check search term
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      String(payload).toLowerCase().includes(searchLower) ||
      String(prediction).toLowerCase().includes(searchLower) ||
      String(response).toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Threat Event Log
          </h1>
          <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            Historical network intelligence and firewall interceptions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search payloads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              color: 'var(--text-main)',
              width: '250px',
              outline: 'none',
              fontFamily: 'monospace'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--text-dim)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cyber-select"
            style={{
              border: '1px solid var(--border-color)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              color: 'var(--text-main)',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--text-dim)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          >
            <option value="All">All Threats</option>
            <option value="SQLi">SQL Injection</option>
            <option value="XSS">Cross Site Scripting</option>
            <option value="Brute Force">Brute Force</option>
            <option value="Command Injection">Sys Command Injection</option>
            <option value="Path Traversal">Dir Path Traversal</option>
            <option value="File Upload">File Upload</option>
            <option value="DDoS">DDoS Pattern</option>
            <option value="CSRF">CSRF Attack</option>
            <option value="JWT">JWT Tampering</option>
            <option value="API Abuse">API Abuse</option>
            <option value="Suspicious">Suspicious</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading && logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <span className="loader" style={{ width: '1.5rem', height: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem', borderWidth: '2px', borderTopColor: 'var(--text-main)' }}></span>
            Synchronizing database...
          </div>
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => {
            const [timestamp, payload, prediction, response] = log;
            const timeStr = new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            const riskColor = getRiskColor(prediction);
            const riskBadge = getRiskBadge(prediction);
            
            return (
              <div 
                key={index} 
                className="cyber-card transition-enter" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  borderLeft: `4px solid ${riskColor}`,
                  padding: '1.5rem',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      background: `${riskColor}10`, 
                      color: riskColor, 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontWeight: 'bold', 
                      fontSize: '0.75rem',
                      border: `1px solid ${riskColor}40`,
                      letterSpacing: '0.05em'
                    }}>
                      {riskBadge}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {prediction || "Undetermined"}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {timeStr}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '0.05em' }}>PAYLOAD RECEIVED:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--primary)', wordBreak: 'break-all', fontSize: '0.9rem' }}>{payload}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '0.05em' }}>SYSTEM RESOLUTION:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{typeof response === 'object' ? JSON.stringify(response, null, 2) : response}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="cyber-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)', borderRadius: '8px' }}>
            No intel matches current filtering criteria.
          </div>
        )}
      </div>

    </div>
  );
}
