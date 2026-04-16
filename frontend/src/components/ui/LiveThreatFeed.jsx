import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveThreatFeed({ threats = [] }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden h-[400px]">
      <div className="text-[var(--text-main)] font-display text-lg font-semibold border-b border-[var(--border-color)] pb-2 mb-2 flex justify-between items-center">
        <h2>Live Intercepts</h2>
        <span className="text-xs text-[var(--accent-cyber)] animate-pulse">Monitoring...</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        <AnimatePresence>
          {threats.length === 0 ? (
            <div className="text-[var(--text-dim)] italic text-sm p-4 text-center">
              No recent threats detected.
            </div>
          ) : (
            threats.map((threat, index) => (
              <motion.div
                key={threat.timestamp + index}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[var(--surface-high)] border border-[var(--border-color)] p-3 rounded-lg flex items-start gap-4"
              >
                <div className={`p-2 rounded-md ${getSeverityColor(threat.attack_type)} bg-opacity-10 mt-1`}>
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.attack_type)} shadow-[0_0_8px_currentColor]`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-medium text-[var(--text-main)] uppercase text-sm">
                      {threat.attack_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[var(--text-dim)] font-mono">
                      {new Date(threat.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--text-dim)] truncate font-mono">
                    {threat.input}
                  </div>
                  <div className="mt-2 text-xs text-[var(--accent-cyber)]/80 flex items-center gap-2">
                    <span>IP: {threat.session_id}</span>
                    <span>•</span>
                    <span>Stage: {threat.stage}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getSeverityColor(type) {
  if (['sqli', 'command_injection', 'ssrf_aws', 'k8s_attack'].includes(type)) return 'bg-[var(--danger)] text-[var(--danger)]';
  if (['xss', 'path_traversal', 'file_upload_attack'].includes(type)) return 'bg-[var(--warning)] text-[var(--warning)]';
  return 'bg-[var(--accent-cyber)] text-[var(--accent-cyber)]';
}
