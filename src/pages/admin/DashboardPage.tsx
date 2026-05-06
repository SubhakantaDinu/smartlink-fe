import { type ElementType } from 'react';
import { useQuery } from '@tanstack/react-query';
import { qrApi } from '../../api/qr.api';
import type { QRCard } from '../../types/qr.types';
import { Badge } from '../../components/ui/Badge';
import { PageSpinner } from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { QrCode, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';

function StatCard({ label, value, icon: Icon, accent }: {
  label: string;
  value: number;
  icon: ElementType;
  accent: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${accent} flex items-center justify-center`}>
          <Icon size={15} className="text-zinc-100" />
        </div>
      </div>
      <p className="text-3xl font-semibold text-zinc-100 tabular-nums">{value}</p>
    </div>
  );
}

function formatDate(ts: { seconds: number } | undefined): string {
  if (!ts) return '—';
  return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['qr-cards'],
    queryFn: () => qrApi.getAll().then((r) => r.data ?? []),
  });

  const cards: QRCard[] = data ?? [];
  const active = cards.filter((c) => c.enabled).length;
  const disabled = cards.length - active;
  const recent = cards.slice(0, 5);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Overview of your QR card platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total QRs" value={cards.length} icon={QrCode} accent="bg-zinc-800" />
        <StatCard label="Active" value={active} icon={CheckCircle2} accent="bg-emerald-500/20" />
        <StatCard label="Disabled" value={disabled} icon={XCircle} accent="bg-red-500/10" />
        <StatCard label="This Month" value={cards.filter(c => {
          const d = new Date(c.created_at.seconds * 1000);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length} icon={Clock} accent="bg-blue-500/10" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-100">Recent QR Codes</h2>
          <Link
            to="/admin/qr"
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-500">No QR codes yet</p>
            <Link to="/admin/generate" className="text-xs text-emerald-400 hover:underline mt-1 inline-block">
              Generate your first QR
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {recent.map((card) => (
              <div key={card.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  {card.logo_url ? (
                    <img src={card.logo_url} alt="" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-zinc-400">
                      {card.business_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{card.business_name}</p>
                  <p className="text-xs text-zinc-500 truncate">{card.owner_name} · {card.phone}</p>
                </div>
                <Badge variant={card.enabled ? 'success' : 'neutral'}>
                  {card.enabled ? 'Live' : 'Off'}
                </Badge>
                <span className="text-xs text-zinc-600 hidden sm:block">{formatDate(card.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
