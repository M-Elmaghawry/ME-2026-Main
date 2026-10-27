export const WHATSAPP_NUMBER = '201096189832';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'info@elmekawy-bim.com';
export const CONTACT_LOCATION = { ar: 'المنصورة، مصر', en: 'Mansoura, Egypt' };
export const CONTACT_PHONE = `+${WHATSAPP_NUMBER}`;
export const CONTACT_PHONE_DISPLAY = '+20 109 618 9832';
export function whatsappLink(message: string): string {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}
