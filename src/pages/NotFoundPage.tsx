import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
        <Zap size={22} className="text-emerald-400" />
      </div>
      <h1 className="text-4xl font-semibold text-zinc-100 mb-2">404</h1>
      <p className="text-sm text-zinc-400 mb-6">This page or card could not be found.</p>
      <Link
        to="/admin"
        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        Go to dashboard →
      </Link>
    </div>
  );
}
