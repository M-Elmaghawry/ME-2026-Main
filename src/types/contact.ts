export interface ContactDraft {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  countryCode: string;
  selectedService: string;
}

export type ContactResultState =
  | { status: 'success' }
  | { status: 'error'; draft: ContactDraft };
