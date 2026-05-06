import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { qrApi } from '../../api/qr.api';
import type { CreateQRInput, QRCard } from '../../types/qr.types';
import { QRFormFields } from '../../components/qr/QRFormFields';
import { Button } from '../../components/ui/Button';
import { Download, Copy, Check, ExternalLink, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  business_name: z.string().min(1, 'Required'),
  owner_name: z.string().min(1, 'Required'),
  phone: z.string().min(7, 'Required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  whatsapp_number: z.string().optional(),
  google_maps_link: z.string().url('Invalid URL').optional().or(z.literal('')),
  upi_id: z.string().optional(),
  youtube_link: z.string().url('Invalid URL').optional().or(z.literal('')),
  google_review_link: z.string().url('Invalid URL').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  logo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

function getCardUrl(slug: string): string {
  return `${window.location.origin}/card/${slug}`;
}

export function QRGeneratorPage() {
  const [generated, setGenerated] = useState<QRCard | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateQRInput>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: qrApi.create,
    onSuccess: (res) => {
      if (res.data) setGenerated(res.data);
      toast.success('QR generated successfully');
    },
    onError: () => toast.error('Failed to generate QR'),
  });

  const handleCopy = async () => {
    if (!generated) return;
    await navigator.clipboard.writeText(getCardUrl(generated.qr_slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const handleDownload = () => {
    if (!generated?.qr_image_base64) return;
    const a = document.createElement('a');
    a.href = generated.qr_image_base64;
    a.download = `smartlink-${generated.qr_slug}.png`;
    a.click();
  };

  const handleReset = () => {
    setGenerated(null);
    reset();
  };

  if (generated) {
    const cardUrl = getCardUrl(generated.qr_slug);
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-100">QR Generated</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Your QR code is ready. Enable it in QR Codes to go live.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center gap-5">
          {generated.qr_image_base64 && (
            <div className="bg-white rounded-xl p-3 shadow-lg">
              <img
                src={generated.qr_image_base64}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Slug</p>
            <code className="text-sm font-mono text-emerald-400 bg-zinc-800 px-2 py-1 rounded">
              {generated.qr_slug}
            </code>
          </div>

          <div className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 flex items-center gap-2">
            <span className="text-xs text-zinc-400 flex-1 truncate">{cardUrl}</span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={handleDownload}>
              <Download size={15} /> Download QR
            </Button>
            <a href={cardUrl} target="_blank" rel="noreferrer" className="flex-1">
              <Button variant="secondary" className="w-full">
                <ExternalLink size={15} /> Preview
              </Button>
            </a>
          </div>

          <div className="pt-2 border-t border-zinc-800 w-full text-center">
            <p className="text-xs text-zinc-500 mb-3">
              This QR is currently <span className="text-zinc-400 font-medium">disabled</span>. Go to QR Codes to enable it.
            </p>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={13} /> Generate another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Generate QR</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Create a new dynamic QR card</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          <QRFormFields register={register} errors={errors} />
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={mutation.isPending} size="lg">
              Generate QR Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
