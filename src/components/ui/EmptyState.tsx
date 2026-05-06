import type { ReactNode } from 'react';
import { QrCode } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
        <QrCode size={22} className="text-zinc-500" />
      </div>
      <p className="text-sm font-medium text-zinc-300 mb-1">{title}</p>
      {description && <p className="text-xs text-zinc-500 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
