import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrApi } from '../../api/qr.api';
import toast from 'react-hot-toast';

interface QRDeleteDialogProps {
  id: string | null;
  businessName: string;
  onClose: () => void;
}

export function QRDeleteDialog({ id, businessName, onClose }: QRDeleteDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => qrApi.remove(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-cards'] });
      toast.success('QR deleted');
      onClose();
    },
    onError: () => toast.error('Failed to delete QR'),
  });

  return (
    <Modal open={!!id} onClose={onClose} title="Delete QR Card" maxWidth="max-w-sm">
      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-300">
              Delete <span className="font-medium text-zinc-100">{businessName}</span>?
            </p>
            <p className="text-xs text-zinc-500 mt-1">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" loading={mutation.isPending} onClick={() => mutation.mutate()}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
