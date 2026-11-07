import type { ContactValues } from '@/lib/contact';

export interface ContactDraft {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  countryCode: ContactValues['countryCode'];
  selectedService: string;
}

export type ContactResultState =
  | { status: 'success' }
  | { status: 'error'; draft: ContactDraft };
