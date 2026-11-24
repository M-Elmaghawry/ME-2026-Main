import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { browserLanguage } from '../lib/browserLanguage';

import { resources } from './resources';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: browserLanguage(),
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
