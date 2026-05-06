import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { qrApi } from '../../api/qr.api';
import { downloadVCF } from '../../utils/vcf';
import type { PublicCardData } from '../../types/qr.types';
import { type ElementType, useState } from 'react';
import {
  Phone, MessageCircle, Mail, MapPin, Wallet, Youtube, Star,
  Instagram, Facebook, Globe, Share2, UserPlus, Copy, Zap,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  icon: ElementType;
  label: string;
  sublabel?: string;
  className?: string;
}

function ActionButton({ href, onClick, icon: Icon, label, sublabel, className = '' }: ActionButtonProps) {
  const inner = (
    <div className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 active:scale-[0.98] transition-all ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-zinc-300" />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-zinc-100">{label}</p>
        {sublabel && <p className="text-xs text-zinc-500 truncate">{sublabel}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="block w-full">
      {inner}
    </button>
  );
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function CardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-zinc-800" />
      <div className="h-5 w-40 bg-zinc-800 rounded-lg" />
      <div className="h-3 w-28 bg-zinc-800 rounded" />
      <div className="w-full space-y-3 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-zinc-900 rounded-xl border border-zinc-800" />
        ))}
      </div>
    </div>
  );
}

export function CardPage() {
  const { slug } = useParams<{ slug: string }>();
  const [upiCopied, setUpiCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-card', slug],
    queryFn: () => qrApi.getPublicBySlug(slug!).then((r) => r.data!),
    enabled: !!slug,
    staleTime: 30_000,
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: data?.business_name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  const handleCopyUPI = async (upi: string) => {
    await navigator.clipboard.writeText(upi);
    setUpiCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setUpiCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#18181b', color: '#f4f4f5', border: '1px solid #27272a' },
      }} />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-sm">
          {isLoading && <CardSkeleton />}

          {isError && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Zap size={20} className="text-emerald-500" />
              </div>
              <p className="text-sm text-zinc-400">Card not found</p>
              <p className="text-xs text-zinc-600 mt-1">This QR code may have been removed.</p>
            </div>
          )}

          {data && <CardContent data={data} onShare={handleShare} onCopyUPI={handleCopyUPI} upiCopied={upiCopied} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
          <Zap size={11} className="text-emerald-600" />
          Powered by SmartLink
        </div>
      </footer>
    </div>
  );
}

interface CardContentProps {
  data: PublicCardData;
  onShare: () => void;
  onCopyUPI: (upi: string) => void;
  upiCopied: boolean;
}

function CardContent({ data, onShare, onCopyUPI, upiCopied }: CardContentProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-5">
        <div className="w-24 h-24 rounded-full border-2 border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
          {data.logo_url ? (
            <img src={data.logo_url} alt={data.business_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-zinc-300">{getInitials(data.business_name)}</span>
          )}
        </div>
        {data.enabled && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-zinc-950" />
          </div>
        )}
      </div>

      {/* Identity */}
      <h1 className="text-xl font-semibold text-zinc-100 text-center leading-tight">
        {data.business_name}
      </h1>
      <p className="text-sm text-zinc-400 mt-1 text-center">{data.owner_name}</p>
      {data.phone && (
        <p className="text-xs text-zinc-600 mt-0.5 text-center">{data.phone}</p>
      )}

      <div className="w-full h-px bg-zinc-800 my-6" />

      {/* Action buttons */}
      <div className="w-full space-y-2.5">
        {data.phone && (
          <ActionButton
            href={`tel:${data.phone}`}
            icon={Phone}
            label="Call Now"
            sublabel={data.phone}
          />
        )}

        {data.whatsapp_number && (
          <ActionButton
            href={`https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}`}
            icon={MessageCircle}
            label="WhatsApp"
            sublabel={data.whatsapp_number}
          />
        )}

        {data.email && (
          <ActionButton
            href={`mailto:${data.email}`}
            icon={Mail}
            label="Send Email"
            sublabel={data.email}
          />
        )}

        {data.google_maps_link && (
          <ActionButton
            href={data.google_maps_link}
            icon={MapPin}
            label="Open Maps"
            sublabel="Find our location"
          />
        )}

        {data.upi_id && (
          <ActionButton
            href={`upi://pay?pa=${data.upi_id}&pn=${encodeURIComponent(data.business_name)}`}
            icon={Wallet}
            label="Pay via UPI"
            sublabel={data.upi_id}
            className={upiCopied ? 'border-emerald-500/30' : ''}
          />
        )}

        {data.upi_id && (
          <button
            onClick={() => onCopyUPI(data.upi_id!)}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Copy size={12} /> Copy UPI ID
          </button>
        )}

        {data.youtube_link && (
          <ActionButton
            href={data.youtube_link}
            icon={Youtube}
            label="YouTube"
            sublabel="Watch our channel"
          />
        )}

        {data.google_review_link && (
          <ActionButton
            href={data.google_review_link}
            icon={Star}
            label="Leave a Review"
            sublabel="Share your experience"
          />
        )}

        {data.instagram && (
          <ActionButton
            href={
              data.instagram.startsWith('http')
                ? data.instagram
                : `https://instagram.com/${data.instagram.replace('@', '')}`
            }
            icon={Instagram}
            label="Instagram"
            sublabel={data.instagram}
          />
        )}

        {data.facebook && (
          <ActionButton
            href={
              data.facebook.startsWith('http')
                ? data.facebook
                : `https://facebook.com/${data.facebook.replace('@', '')}`
            }
            icon={Facebook}
            label="Facebook"
            sublabel={data.facebook}
          />
        )}

        {data.website && (
          <ActionButton
            href={data.website}
            icon={Globe}
            label="Website"
            sublabel={data.website.replace(/^https?:\/\//, '')}
          />
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 w-full mt-6">
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-sm text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <Share2 size={15} /> Share
        </button>
        <button
          onClick={() => downloadVCF(data)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-sm text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <UserPlus size={15} /> Save Contact
        </button>
      </div>
    </div>
  );
}
