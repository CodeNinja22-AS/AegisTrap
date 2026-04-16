import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AgenticTerminal({ log }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="w-full h-full min-h-[300px] bg-[var(--surface-low)] rounded-xl border border-[var(--border-color)] overflow-hidden flex flex-col relative font-mono">
      {/* Scanline effect */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
      
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-high)] border-b border-[var(--border-color)] z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] text-[var(--accent-cyber)]/50 tracking-widest">MISTRAL_7B_RUNTIME</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto text-sm text-[var(--accent-cyber)] space-y-4"
        style={{ textShadow: "0 0 5px rgba(0, 242, 255, 0.4)" }}
      >
        {log ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={log.input + log.timestamp}
          >
            <div className="mb-2">
              <span className="text-[var(--danger)]">sys@aegis:~$</span> 
              <span className="ml-2 text-white">{log.input}</span>
            </div>
            <div className="text-[var(--text-dim)] whitespace-pre-wrap pl-4 leading-relaxed">
              {log.response || "Generating hallucination..."}
            </div>
            
            <div className="mt-2 text-xs border-t border-[var(--accent-cyber)]/20 pt-2 inline-block">
              Classification:{' '}
              <span className="bg-[var(--accent-cyber)]/20 text-[#00f2ff] px-2 py-0.5 rounded">
                {log.attack_type.toUpperCase()}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center h-full justify-center opacity-50">
            <span className="animate-pulse">Awaiting incoming connection...</span>
          </div>
        )}
      </div>
    </div>
  );
}
