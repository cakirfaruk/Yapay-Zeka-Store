import { getTranslations } from 'next-intl/server';

const plans = [
  {
    name: 'Bireysel Başlangıç',
    price: '₺0',
    features: ['Mağaza erişimi', '1 cihaz eşleştirme']
  },
  {
    name: 'Kurumsal',
    price: '₺199/ay',
    features: ['10 cihaz', 'Öncelikli destek', 'Gelişmiş raporlama']
  },
  {
    name: 'Developer Studio',
    price: '₺129/ay',
    features: ['Sınırsız uygulama', 'Gelir paylaşımı raporları']
  }
];

export default async function PricingPage() {
  const t = await getTranslations('nav');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">{t('pricing')}</h1>
        <p className="text-sm text-slate-400">Planınızı seçin ve platformdan gelir elde etmeye başlayın.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-2 text-2xl text-indigo-300">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
