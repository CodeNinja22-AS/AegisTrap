import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { getInsights } from "../services/api";
import { GlassContainer } from "./ui/GlassContainer";
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

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
    const interval = setInterval(fetchInsights, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Activity className="w-12 h-12 text-[var(--accent-cyber)] animate-pulse" />
        <p className="text-[var(--text-dim)] font-mono text-xs uppercase tracking-widest">Compiling Analytics Data...</p>
      </div>
    );
  }

  if (!data) return <div className="text-[var(--danger)] p-8">Critical error in data telemetry stream.</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--text-main)] tracking-widest uppercase mb-1">
            Threat Intelligence
          </h1>
          <p className="text-[var(--text-dim)] text-xs font-mono uppercase tracking-widest">
            Predictive modeling and packet categorization metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--accent-cyber)]/10 border border-[var(--accent-cyber)]/30">
            <TrendingUp className="w-3 h-3 text-[var(--accent-cyber)]" />
            <span className="text-[10px] font-bold text-[var(--accent-cyber)] tracking-widest uppercase">Live Telemetry</span>
          </div>
          {data.mode === 'demo' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--warning)]/10 border border-[var(--warning)]/30 text-[var(--warning)]">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] font-bold tracking-widest uppercase leading-none">Sim Mode</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Line Chart */}
        <GlassContainer className="col-span-12 p-8" delay={0.1}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-display font-bold text-[var(--text-main)] flex items-center gap-3 uppercase tracking-[0.15em]">
              <BarChart3 className="w-4 h-4 text-[var(--accent-cyber)]" />
              24-Hour Threat Velocity
            </h3>
            <div className="text-[10px] font-mono text-[var(--text-dim)] uppercase">Sampling Rate: 1Hz</div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.time_series} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }} 
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '11px', padding: '1px 0', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="sqli" name="SQLi" stroke={COLORS.sqli} fill={COLORS.sqli} fillOpacity={0.05} strokeWidth={2} />
                <Area type="monotone" dataKey="xss" name="XSS" stroke={COLORS.xss} fill={COLORS.xss} fillOpacity={0.05} strokeWidth={2} />
                <Area type="monotone" dataKey="ddos_pattern" name="DDoS" stroke={COLORS.ddos_pattern} fill={COLORS.ddos_pattern} fillOpacity={0.05} strokeWidth={2} />
                <Area type="monotone" dataKey="bruteforce" name="Brute" stroke={COLORS.bruteforce} fill={COLORS.bruteforce} fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassContainer>

        {/* Small Charts */}
        <GlassContainer className="col-span-12 lg:col-span-7 p-8" delay={0.2}>
          <h3 className="text-sm font-display font-bold text-[var(--text-main)] flex items-center gap-3 uppercase tracking-[0.15em] mb-8">
            <Info className="w-4 h-4 text-[var(--danger)]" />
            Top Infection Vectors
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_payloads} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }} width={80} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.top_payloads.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassContainer>

        <GlassContainer className="col-span-12 lg:col-span-5 p-8" delay={0.3}>
          <h3 className="text-sm font-display font-bold text-[var(--text-main)] flex items-center gap-3 uppercase tracking-[0.15em] mb-8">
            <PieIcon className="w-4 h-4 text-[var(--warning)]" />
            Entity Classification
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.classification_accuracy}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.classification_accuracy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontFamily: 'monospace', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
