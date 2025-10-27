import Link from 'next/link';
import { getApp, listDevices } from '../../../../src/lib/api';
import { getBuyerEmail } from '../../../../src/lib/session';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: { slug: string; locale: string };
}

export default async function AppDetailPage({ params }: Props) {
  try {
    const app = await getApp(params.slug);
    const devices = await listDevices(getBuyerEmail());
    const t = await getTranslations('checkout');

    async function buyAction(formData: FormData) {
      'use server';
      const deviceId = formData.get('deviceId')?.toString();
      const base = `/${params.locale}/checkout?app=${app.slug}`;
      const target = deviceId ? `${base}&device=${deviceId}` : base;
      redirect(target);
    }

    return (
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-white" data-testid="app-detail-title">
              {app.name}
            </h1>
            <p className="mt-2 text-slate-300">{app.synopsis}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-300">Özellikler</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <dt>Kategori</dt>
                <dd>{app.category}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Fiyat</dt>
                <dd>${(app.priceCents / 100).toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Desteklenen kartlar</dt>
                <dd>{app.supportedBoards.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">{t('review')}</h2>
          <form action={buyAction} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-400">{t('deviceLabel')}</label>
              <select name="deviceId" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                <option value="">{t('devicePlaceholder')}</option>
                {devices.map((device: any) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400" type="submit">
              {t('buy')}
            </button>
          </form>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <p>{t('cartHint')}</p>
            <Link
              href={`/${params.locale}/cart?app=${app.slug}`}
              className="mt-3 inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-500 hover:text-indigo-300"
              data-testid="add-to-cart-button"
            >
              {t('addToCart')}
            </Link>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
