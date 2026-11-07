// EmailJS browser identifiers are public and included in the built site.
// Environment variables can override these defaults for other deployments.
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_uvsxh05',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_povivng',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'pmve4ZxWliMqrn0g6',
};
