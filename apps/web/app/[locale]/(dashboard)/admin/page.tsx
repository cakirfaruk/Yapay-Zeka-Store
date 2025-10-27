import { getAdminEmail } from '../../../../src/lib/session';
import { getReviewQueue } from '../../../../src/lib/api';
import { getTranslations } from 'next-intl/server';
import { approveApp, requestChanges } from '../../../../src/actions/apps';

export default async function AdminPage() {
  const email = getAdminEmail();
  const reviews = await getReviewQueue(email);
  const t = await getTranslations('admin');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">{t('reviews')}</h1>
        <p className="text-sm text-slate-400">Admin onay kuyruğunu yönetin.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Uygulama</th>
              <th className="px-4 py-3 text-left">Durum</th>
              <th className="px-4 py-3 text-left">Geliştirici</th>
              <th className="px-4 py-3 text-right">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {reviews.map((item: any) => (
              <tr key={item.id} data-testid="admin-review-row">
                <td className="px-4 py-4 text-sm text-white">{item.name}</td>
                <td className="px-4 py-4 text-sm text-slate-300" data-testid="admin-review-status">
                  {item.status}
                </td>
                <td className="px-4 py-4 text-sm text-slate-300">{item.owner?.email}</td>
                <td className="px-4 py-4 text-right text-sm text-slate-200">
                  <div className="flex justify-end gap-2">
                    <form action={async () => requestChanges(item.id, 'Eksik checklist')}>
                      <button
                        className="rounded-lg border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20"
                        data-testid="request-changes-button"
                      >
                        {t('requestChanges')}
                      </button>
                    </form>
                    <form action={async () => approveApp(item.id)}>
                      <button
                        className="rounded-lg border border-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                        data-testid="approve-button"
                      >
                        {t('approve')}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
