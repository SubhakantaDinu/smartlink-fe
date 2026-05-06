import type { PublicCardData } from '../types/qr.types';

export function downloadVCF(card: PublicCardData): void {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.owner_name}`,
    `ORG:${card.business_name}`,
    `TEL;TYPE=CELL:${card.phone}`,
  ];

  if (card.email) lines.push(`EMAIL:${card.email}`);
  if (card.whatsapp_number) lines.push(`TEL;TYPE=WORK:${card.whatsapp_number}`);
  if (card.website) lines.push(`URL:${card.website}`);
  if (card.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${card.instagram}`);
  if (card.logo_url) lines.push(`PHOTO;VALUE=URI:${card.logo_url}`);

  lines.push(`NOTE:${card.business_name} — SmartLink Digital Card`);
  lines.push('END:VCARD');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${card.owner_name.replace(/\s+/g, '_')}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
