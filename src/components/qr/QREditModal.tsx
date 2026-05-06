import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { QRFormFields } from './QRFormFields';
import type { QRCard, CreateQRInput } from '../../types/qr.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrApi } from '../../api/qr.api';
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

interface QREditModalProps {
  card: QRCard | null;
  onClose: () => void;
}

export function QREditModal({ card, onClose }: QREditModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateQRInput>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (card) reset(card as CreateQRInput);
  }, [card, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateQRInput>) => qrApi.update(card!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-cards'] });
      toast.success('QR updated successfully');
      onClose();
    },
    onError: () => toast.error('Failed to update QR'),
  });

  const onSubmit = (data: CreateQRInput) => mutation.mutate(data);

  return (
    <Modal open={!!card} onClose={onClose} title="Edit QR Card" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <QRFormFields register={register} errors={errors} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
