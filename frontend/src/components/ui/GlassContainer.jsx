import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function GlassContainer({ children, className, delay = 0, hoverable = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-[var(--surface-low)] border border-[var(--border-color)]",
        hoverable && "transition-all duration-300 hover:bg-[var(--surface-high)] hover:border-[var(--accent-cyber)]/30 hover:shadow-[0_0_30px_rgba(0,242,255,0.05)]",
        className
      )}
    >
      {/* Subtle ambient light gradient in top right corner */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-cyber)]/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
