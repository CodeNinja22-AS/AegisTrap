import { motion } from 'framer-motion';
import { cn } from './GlassContainer';

export function NeonButton({ children, onClick, variant = 'primary', className, icon, disabled = false }) {
  const baseClasses = "relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display font-semibold tracking-wide transition-all overflow-hidden";
  
  const variants = {
    primary: "bg-[var(--primary)] text-black hover:bg-[var(--primary-container)] hover:shadow-[0_0_20px_var(--primary)]/40",
    secondary: "bg-transparent text-[var(--primary)] border border-[var(--outline-variant)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/10",
    danger: "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)] hover:text-black hover:shadow-[0_0_20px_var(--danger)]/40",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variants[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {/* Light sweep effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
      
      <div className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </div>
    </motion.button>
  );
}
