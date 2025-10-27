import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function CheckoutSuccessPage({ params, searchParams }: { params: { locale: string }; searchParams: { slug?: string } }) {
  const t = await getTranslations('checkout');
  const slug = searchParams?.slug ?? '';
  const cartHref = slug ? `/${params.locale}/cart?app=${slug}` : `/${params.locale}/cart`;
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-10 text-center">
      <h1 className="text-2xl font-semibold text-emerald-200">{t('success')}</h1>
      <p className="mt-3 text-sm text-emerald-100">{t('deploy')}</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link href={`/${params.locale}/devices`} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-900">
          {t('deploy')}
        </Link>
        <Link href={cartHref} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-300">
          {t('viewCart')}
        </Link>
        <Link href={`/${params.locale}`} className="text-sm text-slate-300 hover:text-white">
          {t('back')}
        </Link>
        {slug && (
          <Link href={`/${params.locale}/app/${slug}`} className="text-xs text-slate-400 hover:text-white">
            {slug}
          </Link>
        )}
      </div>
    </div>
  );
}
