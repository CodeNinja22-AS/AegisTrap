import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { getInsights } from "../services/api";

const COLORS = {
  sqli: "#FF4D4D",
  xss: "#FFA500",
  bruteforce: "#00FFC6",
  command_injection: "#FF1493",
  path_traversal: "#BA55D3",
  file_upload_attack: "#DA70D6",
  ddos_pattern: "#FF0000",
  csrf: "#FFD700",
  jwt_attack: "#9370DB",
  api_abuse: "#FF8C00",
  suspicious: "#FFA500",
  pie: ["#00FFC6", "#FFA500", "#FF4D4D", "#8B949E", "#FF1493", "#BA55D3", "#DA70D6", "#FF0000", "#FFD700", "#9370DB", "#FF8C00"],
};

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const res = await getInsights();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch insights", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // Refresh insights occasionally
    const interval = setInterval(fetchInsights, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-dim)' }}>
        <span className="loader" style={{ width: '2rem', height: '2rem', borderWidth: '3px', borderTopColor: 'var(--accent-cyber)', marginRight: '1rem' }}></span>
        <h2>Crunching Vector Telemetry...</h2>
      </div>
    );
  }

  if (!data) {
    return <div style={{ color: 'var(--danger)', padding: '2rem' }}>Error loading neural insights.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Threat Intel Analytics
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
            Deep packet inspection and machine learning categorization trends.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {data.mode === 'dummy' ? (
            <div style={{ background: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.3)', color: 'var(--warning)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              SIMULATION MODE ACTIVE
            </div>
          ) : (
            <div style={{ background: 'rgba(0, 255, 198, 0.1)', border: '1px solid rgba(0, 255, 198, 0.3)', color: 'var(--accent-cyber)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              LIVE METRICS ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        
        {/* Row 1: Time Series Area Chart */}
        <div className="cyber-card transition-enter" style={{ gridColumn: 'span 12', padding: '1.5rem', animationDelay: '0s' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <span style={{ color: 'var(--accent-cyber)' }}>//</span> 24-HOUR THREAT VELOCITY
          </h3>
          <div style={{ width: '100%', height: '450px' }}>
            <ResponsiveContainer>
              <AreaChart data={data.time_series} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorSqli" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.sqli} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.sqli} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorXss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.xss} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.xss} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBrute" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.bruteforce} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.bruteforce} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCmd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.command_injection} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.command_injection} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPath" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.path_traversal} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.path_traversal} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.file_upload_attack} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.file_upload_attack} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDdos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.ddos_pattern} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.ddos_pattern} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCsrf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.csrf} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.csrf} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorJwt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.jwt_attack} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.jwt_attack} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.api_abuse} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.api_abuse} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSusp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.suspicious} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.suspicious} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="#666" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <YAxis stroke="#666" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <RechartsTooltip 
                  wrapperStyle={{ zIndex: 1000 }}
                  contentStyle={{ backgroundColor: 'var(--surface-high)', border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 1000 }}
                  itemStyle={{ fontSize: '13px', fontWeight: 'bold', padding: '2px 0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px' }} />
                <Area type="monotone" dataKey="sqli" name="SQL Injection" stroke={COLORS.sqli} fillOpacity={1} fill="url(#colorSqli)" strokeWidth={2} />
                <Area type="monotone" dataKey="xss" name="Cross-Site Scripting" stroke={COLORS.xss} fillOpacity={1} fill="url(#colorXss)" strokeWidth={2} />
                <Area type="monotone" dataKey="bruteforce" name="Brute Force" stroke={COLORS.bruteforce} fillOpacity={1} fill="url(#colorBrute)" strokeWidth={2} />
                <Area type="monotone" dataKey="command_injection" name="Command Injection" stroke={COLORS.command_injection} fillOpacity={1} fill="url(#colorCmd)" strokeWidth={2} />
                <Area type="monotone" dataKey="path_traversal" name="Path Traversal" stroke={COLORS.path_traversal} fillOpacity={1} fill="url(#colorPath)" strokeWidth={2} />
                <Area type="monotone" dataKey="file_upload_attack" name="File Upload" stroke={COLORS.file_upload_attack} fillOpacity={1} fill="url(#colorUpload)" strokeWidth={2} />
                <Area type="monotone" dataKey="ddos_pattern" name="DDoS Pattern" stroke={COLORS.ddos_pattern} fillOpacity={1} fill="url(#colorDdos)" strokeWidth={2} />
                <Area type="monotone" dataKey="csrf" name="CSRF" stroke={COLORS.csrf} fillOpacity={1} fill="url(#colorCsrf)" strokeWidth={2} />
                <Area type="monotone" dataKey="jwt_attack" name="JWT Tampering" stroke={COLORS.jwt_attack} fillOpacity={1} fill="url(#colorJwt)" strokeWidth={2} />
                <Area type="monotone" dataKey="api_abuse" name="API Abuse" stroke={COLORS.api_abuse} fillOpacity={1} fill="url(#colorApi)" strokeWidth={2} />
                <Area type="monotone" dataKey="suspicious" name="Suspicious" stroke={COLORS.suspicious} fillOpacity={1} fill="url(#colorSusp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Left - Top Payloads */}
        <div className="cyber-card transition-enter" style={{ gridColumn: 'span 7', padding: '1.5rem', animationDelay: '0.1s' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <span style={{ color: 'var(--danger)' }}>//</span> FREQUENT INFECTION VECTORS
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={data.top_payloads} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                <XAxis type="number" stroke="#666" tick={{ fill: '#8B949E' }} />
                <YAxis dataKey="type" type="category" stroke="#666" tick={{ fill: '#8B949E', fontSize: 12 }} width={80} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                  formatter={(value, name, props) => [value, props.payload.payload]}
                  labelFormatter={() => 'Raw Payload Signature'}
                />
                <Bar dataKey="count" fill="var(--danger)" radius={[0, 4, 4, 0]}>
                  {data.top_payloads.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Right - ML Confidence Pie */}
        <div className="cyber-card transition-enter" style={{ gridColumn: 'span 5', padding: '1.5rem', animationDelay: '0.2s' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <span style={{ color: 'var(--warning)' }}>//</span> ML PIPELINE CLASSIFICATION
          </h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.classification_accuracy}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.classification_accuracy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
