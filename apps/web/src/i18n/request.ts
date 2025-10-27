import { notFound } from 'next/navigation';
import { locales, type Locale, defaultLocale } from './config';

const translations: Record<Locale, () => Promise<any>> = {
  tr: () => import('./messages/tr.json').then((mod) => mod.default),
  en: () => import('./messages/en.json').then((mod) => mod.default),
};

export async function getRequestConfig(locale: string) {
  const normalized = (locale ?? defaultLocale) as Locale;
  if (!locales.includes(normalized)) {
    notFound();
  }
  return translations[normalized]();
}
