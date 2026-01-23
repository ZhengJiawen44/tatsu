import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en','zh', 'de', 'ja', 'ar', 'ru', 'es'],
 
  defaultLocale: 'en'
});