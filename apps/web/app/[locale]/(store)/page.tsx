import { listApps } from '../../../src/lib/api';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

export default async function CatalogPage({ params, searchParams }: { params: { locale: string }; searchParams: { q?: string } }) {
  const apps = await listApps({ search: searchParams?.q });
  const t = await getTranslations('home');

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600/30 via-slate-900 to-slate-950 p-10 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">{t('hero')}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">{t('subtitle')}</p>
        <form className="mt-6 flex max-w-md items-center rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2">
          <input
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            placeholder={t('searchPlaceholder')}
            name="q"
            defaultValue={searchParams?.q ?? ''}
          />
          <button className="rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">Ara</button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app: any) => (
          <Link
            key={app.id}
            href={`/${params.locale}/app/${app.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-indigo-500"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white" data-testid="app-card-title">
                  {app.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-indigo-300">{app.category}</p>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200">${(app.priceCents / 100).toFixed(2)}</span>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-slate-300">{app.synopsis}</p>
            <div className="mt-auto flex items-center gap-2 pt-6 text-xs text-slate-400">
              <span>Desteklenen kartlar:</span>
              <span>{app.supportedBoards.join(', ')}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
