import type { CoursePrice } from '../data/coursePricing';
import type { Language } from './language';

export function validOfferDate(value: string): boolean {
  return /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
}

export function currentPrice(config: CoursePrice, now = Date.now()) {
  const official = config.officialPrice;
  const offer = config.offer;
  const start = offer?.startsAt ? Date.parse(offer.startsAt) : -Infinity;
  const end = offer ? Date.parse(offer.endsAt) : NaN;
  const active = official !== null && official > 0 && offer &&
    Number.isFinite(offer.price) && offer.price >= 0 && offer.price < official &&
    validOfferDate(offer.endsAt) && (!offer.startsAt || validOfferDate(offer.startsAt)) &&
    start <= now && now < end;
  return {
    price: active ? offer.price : official,
    originalPrice: active ? official : null,
    discount: active ? Math.round((1 - offer.price / official) * 100) : null,
    endsAt: active ? offer.endsAt : null,
  };
}

export function formatPrice(value: number | null, currency: string, language: Language): string {
  if (value === null) return language === 'ar' ? 'تواصل لمعرفة السعر' : 'Contact for pricing';
  if (value === 0) return language === 'ar' ? 'مجاني' : 'Free';
  return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency', currency, maximumFractionDigits: 2,
  }).format(value);
}

export function remainingTime(endsAt: string, now: number, language: Language): string {
  const minutes = Math.max(0, Math.ceil((Date.parse(endsAt) - now) / 60000));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor(minutes % 1440 / 60);
  return language === 'ar' ? `${days} يوم ${hours} ساعة ${minutes % 60} دقيقة` : `${days}d ${hours}h ${minutes % 60}m`;
}
