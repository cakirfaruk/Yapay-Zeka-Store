import Link from 'next/link';
import { getApp, createCheckout, listDevices } from '../../../../src/lib/api';
import { getBuyerEmail } from '../../../../src/lib/session';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface CheckoutPageProps {
  params: { locale: string };
  searchParams: { app?: string; device?: string };
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { locale } = params;
  const slug = searchParams?.app ?? '';
  const preselectedDevice = searchParams?.device ?? '';
  const t = await getTranslations('checkout');

  if (!slug) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-white">{t('title')}</h1>
        <p className="text-sm text-slate-400">{t('empty')}</p>
        <div className="flex justify-center gap-3">
          <Link href={`/${locale}`} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
            {t('back')}
          </Link>
          <Link href={`/${locale}/cart`} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">
            {t('viewCart')}
          </Link>
        </div>
      </div>
    );
  }

  let app;
  try {
    app = await getApp(slug);
  } catch (error) {
    return notFound();
  }

  const buyerEmail = getBuyerEmail();
  const devices = await listDevices(buyerEmail);

  async function completeCheckout(formData: FormData) {
    'use server';
    const deviceId = formData.get('deviceId')?.toString() || undefined;
    await createCheckout(buyerEmail, app.id, deviceId);
    revalidatePath(`/${locale}/devices`);
    redirect(`/${locale}/checkout/success?slug=${app.slug}`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">{t('title')}</h1>
        <p className="text-sm text-slate-400">{t('review')}</p>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6" data-testid="checkout-summary">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-300">{t('summary')}</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <dt>{app.name}</dt>
              <dd>${(app.priceCents / 100).toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <dt>{t('category')}</dt>
              <dd>{app.category}</dd>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <dt>{t('boards')}</dt>
              <dd>{app.supportedBoards.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="space-y-6">
        <form action={completeCheckout} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="deviceId">
              {t('deviceLabel')}
            </label>
            <select
              id="deviceId"
              name="deviceId"
              defaultValue={preselectedDevice}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            >
              <option value="">{t('devicePlaceholder')}</option>
              {devices.map((device: any) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">{t('deviceHelp')}</p>
          </div>
          <button className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
            {t('complete')}
          </button>
        </form>
        <Link href={`/${locale}/cart?app=${app.slug}`} className="block text-center text-sm text-slate-300 hover:text-white">
          {t('editCart')}
        </Link>
      </section>
    </div>
  );
}
