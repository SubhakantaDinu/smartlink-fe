import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../ui/Input';
import type { CreateQRInput } from '../../types/qr.types';

interface QRFormFieldsProps {
  register: UseFormRegister<CreateQRInput>;
  errors: FieldErrors<CreateQRInput>;
  showOptional?: boolean;
}

export function QRFormFields({ register, errors, showOptional = true }: QRFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Business Name *"
          placeholder="ABC Electronics"
          error={errors.business_name?.message}
          {...register('business_name')}
        />
        <Input
          label="Owner Name *"
          placeholder="Rahul Sharma"
          error={errors.owner_name?.message}
          {...register('owner_name')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone *"
          placeholder="+919876543210"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="WhatsApp"
          placeholder="+919876543210"
          {...register('whatsapp_number')}
        />
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="business@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      {showOptional && (
        <>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Links & Payments</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Google Maps Link"
              placeholder="https://maps.google.com/..."
              error={errors.google_maps_link?.message}
              {...register('google_maps_link')}
            />
            <Input
              label="UPI ID"
              placeholder="business@upi"
              {...register('upi_id')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="YouTube"
              placeholder="https://youtube.com/..."
              error={errors.youtube_link?.message}
              {...register('youtube_link')}
            />
            <Input
              label="Google Review Link"
              placeholder="https://g.page/..."
              error={errors.google_review_link?.message}
              {...register('google_review_link')}
            />
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Social & Web</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Website"
              placeholder="https://example.com"
              error={errors.website?.message}
              {...register('website')}
            />
            <Input
              label="Instagram"
              placeholder="@handle"
              {...register('instagram')}
            />
            <Input
              label="Facebook"
              placeholder="@page"
              {...register('facebook')}
            />
          </div>
          <Input
            label="Logo URL"
            placeholder="https://..."
            error={errors.logo_url?.message}
            {...register('logo_url')}
          />
        </>
      )}
    </div>
  );
}
