import { useEffect, useState } from "react";
import { getAnalysis, getLogs } from "../services/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ATTACK_COLORS = {
  "sqli": "#FF4D4D",
  "xss": "#FFA500",
  "bruteforce": "#00FFC6",
  "suspicious": "#FFA500",
  "command_injection": "#FF4D4D",
  "path_traversal": "#FFA500",
  "file_upload_attack": "#DA70D6",
  "ddos_pattern": "#FF0000",
  "csrf": "#FFD700",
  "jwt_attack": "#9370DB",
  "api_abuse": "#FF8C00",
  "normal": "#8B949E"
};

export default function Dashboard() {
  const [data, setData] = useState({ total: 0, attack_counts: {} });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysisRes, logsRes] = await Promise.all([
          getAnalysis(),
          getLogs()
        ]);
        setData(analysisRes);
        setLogs(logsRes);
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(); // Initial load
    const interval = setInterval(fetchData, 3000); // Live poll
    return () => clearInterval(interval);
  }, []);

  const sqliCount = data.attack_counts["sqli"] || 0;
  const xssCount = data.attack_counts["xss"] || 0;
  const bruteForceCount = data.attack_counts["bruteforce"] || 0;
  const cmdInjectionCount = data.attack_counts["command_injection"] || 0;
  const pathTraversalCount = data.attack_counts["path_traversal"] || 0;
  const ddosCount = data.attack_counts["ddos_pattern"] || 0;
  const uploadCount = data.attack_counts["file_upload_attack"] || 0;
  const csrfCount = data.attack_counts["csrf"] || 0;
  const jwtCount = data.attack_counts["jwt_attack"] || 0;
  const apiCount = data.attack_counts["api_abuse"] || 0;
  const suspiciousCount = data.attack_counts["suspicious"] || 0;

  // Format data for Recharts
  const chartData = Object.entries(data.attack_counts).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ marginBottom: 0 }}>System Overview</h1>
      
      {/* Section 1: Top Metrics Row */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem' }}>
        
        <div className="cyber-card" style={{ borderTop: '3px solid var(--text-main)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Total Attacks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>{loading ? "-" : data.total}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid var(--danger)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>SQLi</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger)', lineHeight: '1' }}>{loading ? "-" : sqliCount}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid var(--warning)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>XSS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--warning)', lineHeight: '1' }}>{loading ? "-" : xssCount}</div>
        </div>

        <div className="cyber-card" style={{ borderTop: '3px solid #FF1493', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>CMD Injection</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FF1493', lineHeight: '1' }}>{loading ? "-" : cmdInjectionCount}</div>
        </div>

        <div className="cyber-card" style={{ borderTop: '3px solid #BA55D3', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Path Traversal</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#BA55D3', lineHeight: '1' }}>{loading ? "-" : pathTraversalCount}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid var(--accent-cyber)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Brute Force</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-cyber)', lineHeight: '1' }}>{loading ? "-" : bruteForceCount}</div>
        </div>

        <div className="cyber-card" style={{ borderTop: '3px solid #DA70D6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>File Upload</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#DA70D6', lineHeight: '1' }}>{loading ? "-" : uploadCount}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid #FF0000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>DDoS Pattern</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FF0000', lineHeight: '1' }}>{loading ? "-" : ddosCount}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid #FFD700', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>CSRF</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFD700', lineHeight: '1' }}>{loading ? "-" : csrfCount}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid #9370DB', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>JWT</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#9370DB', lineHeight: '1' }}>{loading ? "-" : jwtCount}</div>
        </div>
        
        <div className="cyber-card" style={{ borderTop: '3px solid #FF8C00', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>API Abuse</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FF8C00', lineHeight: '1' }}>{loading ? "-" : apiCount}</div>
        </div>

        <div className="cyber-card" style={{ borderTop: '3px solid #FFA500', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Suspicious</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFA500', lineHeight: '1' }}>{loading ? "-" : suspiciousCount}</div>
        </div>

      </div>

      {/* CSS Grid for Section 2 (Graph) & Section 3 (Feed) */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Section 2: Center Graph Area */}
        <div className="cyber-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Attack Distribution</h2>
          <div style={{ flex: 1, minHeight: 0 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ATTACK_COLORS[entry.name] || '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                {loading ? "Analyzing telemetry..." : "No data available"}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Right Feed Area */}
        <div className="cyber-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Live Threat Feed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {logs.length > 0 ? (
              [...logs].reverse().slice(0, 50).map((log, idx) => {
                const [timestamp, payload, prediction] = log;
                const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                
                let color = "var(--primary)";
                if (prediction === "sqli" || prediction === "command_injection" || prediction === "ddos_pattern") color = "var(--danger)";
                else if (prediction === "xss" || prediction === "suspicious" || prediction === "path_traversal" || prediction === "file_upload_attack" || prediction === "csrf" || prediction === "jwt_attack" || prediction === "api_abuse") color = "var(--warning)";
                else if (prediction === "bruteforce") color = "var(--accent-cyber)";

                return (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'baseline',
                    gap: '0.75rem', 
                    padding: '0.75rem', 
                    background: 'rgba(0,0,0,0.2)', 
                    borderLeft: `2px solid ${color}`,
                    borderRadius: '0 4px 4px 0',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'monospace', fontSize: '0.8rem' }}>[{timeStr}]</span>
                    <span style={{ color, fontWeight: '600', whiteSpace: 'nowrap' }}>{prediction}</span>
                    <span style={{ color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'right' }}>
                      {payload.length > 30 ? payload.substring(0, 30) + '...' : payload}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                {loading ? "Establishing connection..." : "No recent activity."}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
