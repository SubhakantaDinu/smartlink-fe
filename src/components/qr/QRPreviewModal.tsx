import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { QRCard } from '../../types/qr.types';
import { Copy, Check, ExternalLink, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRPreviewModalProps {
  card: QRCard | null;
  onClose: () => void;
}

function getCardUrl(slug: string): string {
  return `${window.location.origin}/card/${slug}`;
}

export function QRPreviewModal({ card, onClose }: QRPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!card) return null;

  const cardUrl = getCardUrl(card.qr_slug);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!card.qr_image_base64) return;
    const a = document.createElement('a');
    a.href = card.qr_image_base64;
    a.download = `smartlink-${card.qr_slug}.png`;
    a.click();
  };

  return (
    <Modal open={!!card} onClose={onClose} title="QR Code Preview" maxWidth="max-w-sm">
      <div className="flex flex-col items-center gap-5">

        {/* QR Image */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          {card.qr_image_base64 ? (
            <img
              src={card.qr_image_base64}
              alt={`QR for ${card.business_name}`}
              className="w-56 h-56"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center bg-zinc-100 rounded-xl">
              <p className="text-zinc-400 text-sm">No QR image</p>
            </div>
          )}
        </div>

        {/* Business info */}
        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-100">{card.business_name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{card.owner_name}</p>
          <code className="text-xs text-emerald-400 mt-1 block">{card.qr_slug}</code>
        </div>

        {/* URL bar */}
        <div className="w-full flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2">
          <span className="text-xs text-zinc-400 flex-1 truncate">{cardUrl}</span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={handleDownload}>
            <Download size={14} /> Download
          </Button>
          <a href={cardUrl} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="primary" className="w-full">
              <ExternalLink size={14} /> Open Card
            </Button>
          </a>
        </div>

      </div>
    </Modal>
  );
}
