import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getRequestConfig } from '../../src/i18n/request';
import { locales } from '../../src/i18n/config';
import { Navbar } from '../../src/components/Navbar';
import { Footer } from '../../src/components/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const locale = params.locale;
  if (!locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getRequestConfig(locale);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-slate-950 text-slate-100">
          <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
