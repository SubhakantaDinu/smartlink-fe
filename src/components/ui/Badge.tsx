import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const styles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  neutral: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
};

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === 'success' ? 'bg-emerald-400' :
        variant === 'warning' ? 'bg-amber-400' :
        variant === 'danger' ? 'bg-red-400' : 'bg-zinc-500'
      }`} />
      {children}
    </span>
  );
}
