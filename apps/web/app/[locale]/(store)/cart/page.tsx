import Link from 'next/link';
import { getApp, listApps } from '../../../../src/lib/api';
import { getTranslations } from 'next-intl/server';

interface CartPageProps {
  params: { locale: string };
  searchParams: { app?: string };
}

export default async function CartPage({ params, searchParams }: CartPageProps) {
  const { locale } = params;
  const slug = searchParams?.app ?? '';
  const t = await getTranslations('cart');
  const recommended = await listApps({ limit: 3 });

  let selectedApp: any | null = null;
  if (slug) {
    try {
      selectedApp = await getApp(slug);
    } catch (error) {
      selectedApp = null;
    }
  }

  const filtered = selectedApp
    ? recommended.filter((app: any) => app.slug !== selectedApp.slug).slice(0, 3)
    : recommended.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">{t('title')}</h1>
            <p className="mt-2 text-sm text-slate-400">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-300"
          >
            {t('explore')}
          </Link>
        </div>

        {selectedApp ? (
          <div className="mt-6 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-6" data-testid="cart-item">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedApp.name}</h2>
                <p className="text-sm text-indigo-200">{t('item')}</p>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-100">
                ${(selectedApp.priceCents / 100).toFixed(2)}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-200">{selectedApp.synopsis}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="rounded border border-slate-700 px-2 py-1">{selectedApp.category}</span>
              <span>{selectedApp.supportedBoards.join(', ')}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/checkout?app=${selectedApp.slug}`}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
              >
                {t('checkout')}
              </Link>
              <Link
                href={`/${locale}/app/${selectedApp.slug}`}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-300"
              >
                {t('view')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center text-slate-400" data-testid="cart-empty">
            {t('empty')}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">{t('recommended')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((app: any) => (
            <div key={app.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-base font-semibold text-white">{app.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-300">{app.synopsis}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{app.category}</span>
                <span>${(app.priceCents / 100).toFixed(2)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/${locale}/app/${app.slug}`}
                  className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-indigo-500 hover:text-indigo-300"
                >
                  {t('view')}
                </Link>
                <Link
                  href={`/${locale}/cart?app=${app.slug}`}
                  className="flex-1 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
                >
                  {t('add')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
