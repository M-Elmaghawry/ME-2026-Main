import { z } from 'zod';
import type { Language } from './language';

export const COUNTRY_CODES = ['+20', '+966', '+971', '+965', '+974', '+973', '+964', '+90', '+34', ''] as const;
export const CONTACT_THROTTLE_MS = 60_000;

export function normalizePhone(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) - (digit <= '٩' ? 0x660 : 0x6f0)))
    .replace(/[\s().-]/g, '');
}

export function internationalPhone(phone: string, countryCode: string): string {
  if (!phone) return '';
  return countryCode ? countryCode + phone.replace(/^0/, '') : phone;
}

export function contactSchema(language: Language, serviceIds: string[]) {
  const message = (ar: string, en: string) => language === 'ar' ? ar : en;
  return z.object({
    name: z.string().trim().min(2, message('أدخل اسمًا من حرفين على الأقل.', 'Enter at least 2 characters.'))
      .max(100, message('الحد الأقصى 100 حرف.', 'Use at most 100 characters.')),
    email: z.string().trim().max(254).email(message('أدخل بريدًا إلكترونيًا صحيحًا.', 'Enter a valid email address.')),
    countryCode: z.enum(COUNTRY_CODES),
    phone: z.string().trim().max(40).transform(normalizePhone)
      .refine((value) => !value || /^\+?\d{7,15}$/.test(value), message('أدخل رقم هاتف صحيحًا من 7 إلى 15 رقمًا.', 'Enter a valid phone number with 7–15 digits.')),
    company: z.string().trim().max(150, message('الحد الأقصى 150 حرفًا.', 'Use at most 150 characters.')),
    service: z.string().refine((value) => !value || serviceIds.includes(value), message('اختر خدمة من القائمة.', 'Choose a service from the list.')),
    message: z.string().trim().min(10, message('اكتب رسالة من 10 أحرف على الأقل.', 'Enter at least 10 characters.'))
      .max(5000, message('الحد الأقصى 5000 حرف.', 'Use at most 5000 characters.')),
    website: z.string().max(0, message('تعذّر إرسال الرسالة.', 'Unable to send this message.')),
  }).superRefine((data, ctx) => {
    if (data.phone && (data.countryCode && data.phone.startsWith('+') ||
        (data.countryCode + data.phone).replace(/\D/g, '').length > 15)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'],
        message: message('أدخل الرقم المحلي فقط، أو اختر «أخرى» للرقم الدولي الكامل.', 'Enter a local number, or choose Other for a full international number.') });
    }
  });
}

export type ContactValues = z.input<ReturnType<typeof contactSchema>>;

export function hasEmailConfiguration(values: (string | undefined)[]): boolean {
  return values.length === 3 && values.every((value) => value?.trim() && !/^your_|^undefined$|^null$/i.test(value.trim()));
}

// Storage restrictions must not prevent sending; retain throttling in memory as a fallback.
const memory = new Map<string, string>();
export const emailStorage = {
  async get(key: string) {
    try { return localStorage.getItem(key) ?? memory.get(key); } catch { return memory.get(key); }
  },
  async set(key: string, value: string) {
    memory.set(key, value);
    try { localStorage.setItem(key, value); } catch { /* use memory */ }
  },
  async remove(key: string) {
    memory.delete(key);
    try { localStorage.removeItem(key); } catch { /* use memory */ }
  },
};
