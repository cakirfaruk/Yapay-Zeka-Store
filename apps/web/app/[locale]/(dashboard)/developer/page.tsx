import { listApps } from '../../../../src/lib/api';
import { getDeveloperEmail } from '../../../../src/lib/session';
import { getTranslations } from 'next-intl/server';
import { submitForReview } from '../../../../src/actions/apps';

export default async function DeveloperPage() {
  const email = getDeveloperEmail();
  const apps = await listApps({ email });
  const t = await getTranslations('developer');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{t('title')}</h1>
          <p className="text-sm text-slate-400">Uygulamalarınızı yönetin ve yayın sürecini takip edin.</p>
        </div>
        <button className="rounded-lg border border-indigo-500 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-200">
          {t('new')}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app: any) => (
          <div key={app.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6" data-testid="developer-app-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                <p className="text-xs uppercase text-indigo-300" data-testid="developer-app-status">
                  {app.status}
                </p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{app.pricingModel}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{app.synopsis}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
              <span>{t('checklist')}</span>
              <span>{app.supportedBoards.join(', ')}</span>
            </div>
            {['draft', 'changes_requested'].includes(app.status) && (
              <form className="mt-4" action={async () => submitForReview(app.id)}>
                <button
                  className="w-full rounded-lg border border-indigo-500 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/30"
                  data-testid="submit-review-button"
                >
                  {t('submit')}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
