export interface CourseOffer {
  price: number;
  // Include a timezone offset, e.g. 2026-12-31T23:59:59+03:00.
  endsAt: string;
  startsAt?: string;
}

export interface CoursePrice {
  officialPrice: number | null;
  currency: string;
  offer?: CourseOffer;
}

// null means the official price is available on request. All values use currency units.
// Example offer (disabled): offer: { price: 99, endsAt: '2026-12-31T23:59:59+03:00' }
export const coursePricing: Record<string, CoursePrice> = {
  'bim-fundamentals': { officialPrice: 0, currency: 'USD' },
  'revit-structure-professional-training': { officialPrice: 130, currency: 'USD' },
  'revit-structure-workshop-01': { officialPrice: null, currency: 'USD' },
  'revit-structure-workshop-02': { officialPrice: null, currency: 'USD' },
  'revit-structure-workshop-03': { officialPrice: null, currency: 'USD' },
};
