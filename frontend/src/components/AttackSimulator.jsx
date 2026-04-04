import { useState, useEffect } from "react";
import { sendAttack } from "../services/api";

export default function AttackSimulator() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Initialize or retrieve session ID on mount
  useEffect(() => {
    let id = localStorage.getItem("aegis_session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("aegis_session_id", id);
    }
    setSessionId(id);
  }, []);

  const handleAttack = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      // Cinematic ML artificial delay
      await new Promise(r => setTimeout(r, 600));

      const res = await sendAttack({
        input: input,
        source: sessionId || "anonymous"
      });
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskDetails = (prediction) => {
    switch (prediction) {
      case "sqli": return { level: "CRITICAL", color: "var(--danger)" };
      case "xss": return { level: "HIGH", color: "var(--warning)" };
      case "bruteforce": return { level: "HIGH", color: "var(--accent-cyber)" };
      case "command_injection": return { level: "CRITICAL", color: "var(--danger)" };
      case "path_traversal": return { level: "HIGH", color: "var(--warning)" };
      case "file_upload_attack": return { level: "HIGH", color: "var(--warning)" };
      case "ddos_pattern": return { level: "CRITICAL", color: "var(--danger)" };
      case "csrf": return { level: "MEDIUM", color: "var(--warning)" };
      case "jwt_attack": return { level: "HIGH", color: "var(--warning)" };
      case "api_abuse": return { level: "MEDIUM", color: "var(--warning)" };
      case "suspicious": return { level: "MEDIUM", color: "var(--warning)" };
      case "normal": return { level: "NONE", color: "var(--text-dim)" };
      default: return { level: "UNKNOWN", color: "var(--primary)" };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', minHeight: '80vh', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'var(--accent-cyber)', fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 10px rgba(0,255,198,0.3)' }}>
          Attack Simulation Console
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Deploy raw payloads directly into the neural defense grid
        </p>
      </div>

      <div className="cyber-card glow-border" style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.05em' }}>
            TARGET PAYLOAD
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., OR 1=1; DROP TABLE users;--"
            style={{
              width: '100%',
              minHeight: '150px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontFamily: 'monospace',
              fontSize: '1rem',
              padding: '1rem',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-cyber)';
              e.target.style.boxShadow = '0 0 12px rgba(0, 255, 198, 0.25), inset 0 0 8px rgba(0, 255, 198, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setInput("1' OR '1'='1")}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}
              onMouseOver={(e) => { e.target.style.color = 'var(--text-main)'; e.target.style.borderColor = 'var(--text-dim)'; }}
              onMouseOut={(e) => { e.target.style.color = 'var(--text-dim)'; e.target.style.borderColor = 'var(--border-color)'; }}
            >
              Demo SQLi
            </button>
            <button 
              onClick={() => setInput("<script>alert('XSS')</script>")}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}
              onMouseOver={(e) => { e.target.style.color = 'var(--text-main)'; e.target.style.borderColor = 'var(--text-dim)'; }}
              onMouseOut={(e) => { e.target.style.color = 'var(--text-dim)'; e.target.style.borderColor = 'var(--border-color)'; }}
            >
              Demo XSS
            </button>
            <button 
              onClick={() => setInput("admin123")}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}
              onMouseOver={(e) => { e.target.style.color = 'var(--text-main)'; e.target.style.borderColor = 'var(--text-dim)'; }}
              onMouseOut={(e) => { e.target.style.color = 'var(--text-dim)'; e.target.style.borderColor = 'var(--border-color)'; }}
            >
              Demo Brute
            </button>
            <button 
              onClick={() => setInput("whoami; ping -c 4 127.0.0.1")}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}
              onMouseOver={(e) => { e.target.style.color = 'var(--text-main)'; e.target.style.borderColor = 'var(--text-dim)'; }}
              onMouseOut={(e) => { e.target.style.color = 'var(--text-dim)'; e.target.style.borderColor = 'var(--border-color)'; }}
            >
              Demo CMD
            </button>
          </div>

          <button 
            onClick={handleAttack}
            disabled={loading || !input.trim()}
            style={{ 
              padding: '0.75rem 2rem', 
              background: loading || !input.trim() ? 'var(--border-color)' : 'var(--danger)', 
              border: 'none', 
              borderRadius: '6px', 
              color: loading || !input.trim() ? 'var(--text-dim)' : '#fff', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              boxShadow: loading || !input.trim() ? 'none' : '0 0 15px rgba(255, 77, 77, 0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseOver={(e) => { 
              if (!loading && input.trim()) {
                e.target.style.transform = 'scale(1.02)'; 
                e.target.style.boxShadow = '0 0 20px rgba(255, 77, 77, 0.6)'; 
              }
            }}
            onMouseOut={(e) => { 
              if (!loading && input.trim()) {
                e.target.style.transform = 'scale(1)'; 
                e.target.style.boxShadow = '0 0 15px rgba(255, 77, 77, 0.4)'; 
              }
            }}
          >
            {loading ? (
              <>
                <span className="loader" style={{ width: '1rem', height: '1rem', borderWidth: '2px', borderTopColor: 'var(--text-main)' }}></span>
                Analyzing...
              </>
            ) : "Deploy Payload"}
          </button>
        </div>

      </div>

      {/* Response Panel - Compromised System Output */}
      {response && response.ai_output && typeof response.ai_output === 'string' && (
        <div 
          className="cyber-card transition-enter" 
          style={{ width: '100%', maxWidth: '900px', borderLeft: `4px solid ${getRiskDetails(response.attack_type).color}`, animation: 'fadeIn 0.4s ease-out', padding: '1.5rem', background: '#0a0a0c' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              System_Output_Stream // {response.attack_type.toUpperCase()}
            </span>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getRiskDetails(response.attack_type).color, boxShadow: `0 0 8px ${getRiskDetails(response.attack_type).color}` }}></div>
          </div>

          <pre style={{ 
            margin: 0,
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace', 
            color: '#d1d1d1', 
            fontSize: '1rem', 
            lineHeight: '1.5',
            padding: '1rem', 
            background: 'rgba(0,0,0,0.4)', 
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.03)',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {response.ai_output}
          </pre>
        </div>
      )}
      
    </div>
  );
}
