import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qrApi } from '../../api/qr.api';
import type { QRCard } from '../../types/qr.types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { QREditModal } from '../../components/qr/QREditModal';
import { QRDeleteDialog } from '../../components/qr/QRDeleteDialog';
import { QRPreviewModal } from '../../components/qr/QRPreviewModal';
import {
  Eye, Pencil, Trash2, Download, ToggleLeft, ToggleRight, Search, Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function formatDate(ts: { seconds: number }): string {
  return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function downloadQR(card: QRCard) {
  if (!card.qr_image_base64) {
    toast.error('No QR image available');
    return;
  }
  const a = document.createElement('a');
  a.href = card.qr_image_base64;
  a.download = `smartlink-${card.qr_slug}.png`;
  a.click();
}

export function QRManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [previewCard, setPreviewCard] = useState<QRCard | null>(null);
  const [editCard, setEditCard] = useState<QRCard | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['qr-cards'],
    queryFn: () => qrApi.getAll().then((r) => r.data ?? []),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => qrApi.toggleStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['qr-cards'] });
      toast.success(res.message);
    },
    onError: () => toast.error('Failed to toggle status'),
  });

  const cards: QRCard[] = (data ?? []).filter((c) => {
    const matchSearch =
      c.business_name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' || (filter === 'active' ? c.enabled : !c.enabled);
    return matchSearch && matchFilter;
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">QR Codes</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{data?.length ?? 0} total cards</p>
        </div>
        <Link to="/admin/generate">
          <Button size="md">Generate QR</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business or owner..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-500" />
          {(['all', 'active', 'disabled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {cards.length === 0 ? (
        <EmptyState
          title="No QR codes found"
          description={search ? 'Try a different search term' : 'Generate your first QR code to get started'}
          action={!search ? <Link to="/admin/generate"><Button size="sm">Generate QR</Button></Link> : undefined}
        />
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-3.5 text-left text-xs text-zinc-500 font-medium uppercase tracking-wider">QR</th>
                  <th className="px-5 py-3.5 text-left text-xs text-zinc-500 font-medium uppercase tracking-wider">Business</th>
                  <th className="px-5 py-3.5 text-left text-xs text-zinc-500 font-medium uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3.5 text-left text-xs text-zinc-500 font-medium uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs text-zinc-500 font-medium uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3.5 text-right text-xs text-zinc-500 font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setPreviewCard(card)}
                        className="group relative"
                        title="Click to preview QR"
                      >
                        {card.qr_image_base64 ? (
                          <img
                            src={card.qr_image_base64}
                            alt="QR"
                            className="w-10 h-10 rounded-lg bg-white p-0.5 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <span className="text-xs text-zinc-500">—</span>
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-100">{card.business_name}</p>
                      <p className="text-xs text-zinc-500">{card.owner_name}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{card.phone}</td>
                    <td className="px-5 py-4">
                      <Badge variant={card.enabled ? 'success' : 'neutral'}>
                        {card.enabled ? 'Live' : 'Off'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{formatDate(card.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/card/${card.qr_slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          title="View card"
                        >
                          <Eye size={15} />
                        </a>
                        <button
                          onClick={() => setEditCard(card)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleMutation.mutate(card.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            card.enabled
                              ? 'text-emerald-500 hover:bg-emerald-500/10'
                              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                          }`}
                          title={card.enabled ? 'Disable' : 'Enable'}
                        >
                          {card.enabled ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        </button>
                        <button
                          onClick={() => downloadQR(card)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          title="Download QR"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => { setDeleteId(card.id); setDeleteName(card.business_name); }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-zinc-800">
            {cards.map((card) => (
              <div key={card.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {card.qr_image_base64 && (
                    <button onClick={() => setPreviewCard(card)} className="flex-shrink-0">
                      <img src={card.qr_image_base64} alt="QR" className="w-12 h-12 rounded-lg bg-white p-0.5 hover:ring-2 hover:ring-emerald-500/50 transition-all" />
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-zinc-100 truncate">{card.business_name}</p>
                      <Badge variant={card.enabled ? 'success' : 'neutral'}>
                        {card.enabled ? 'Live' : 'Off'}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">{card.owner_name} · {card.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/card/${card.qr_slug}`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="ghost"><Eye size={13} /> View</Button>
                  </a>
                  <Button size="sm" variant="ghost" onClick={() => setEditCard(card)}><Pencil size={13} /> Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleMutation.mutate(card.id)}>
                    {card.enabled ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    {card.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => { setDeleteId(card.id); setDeleteName(card.business_name); }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <QRPreviewModal card={previewCard} onClose={() => setPreviewCard(null)} />
      <QREditModal card={editCard} onClose={() => setEditCard(null)} />
      <QRDeleteDialog id={deleteId} businessName={deleteName} onClose={() => setDeleteId(null)} />
    </div>
  );
}
