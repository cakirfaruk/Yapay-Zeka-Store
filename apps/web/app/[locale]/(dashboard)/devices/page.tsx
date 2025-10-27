import { claimDevice, listDevices } from '../../../../src/lib/api';
import { getBuyerEmail } from '../../../../src/lib/session';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function DevicesPage({ params }: { params: { locale: string } }) {
  const email = getBuyerEmail();
  const devices = await listDevices(email);
  const t = await getTranslations('devices');

  async function claimAction() {
    'use server';
    await claimDevice(email);
    revalidatePath(`/${params.locale}/devices`);
    redirect(`/${params.locale}/devices`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{t('title')}</h1>
          <p className="text-sm text-slate-400">Cihazları yönetin ve telemetriyi izleyin.</p>
        </div>
        <form action={claimAction}>
          <button className="rounded-lg border border-indigo-500 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-200 hover:bg-indigo-500/40">
            {t('add')}
          </button>
        </form>
      </div>

      {devices.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">{t('empty')}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Ad</th>
                <th className="px-4 py-3 text-left">Donanım</th>
                <th className="px-4 py-3 text-left">{t('status')}</th>
                <th className="px-4 py-3 text-left">Etiketler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {devices.map((device: any) => (
                <tr key={device.id}>
                  <td className="px-4 py-4 text-sm text-white">{device.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{device.hw}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {device.lastSeen ? 'Online' : 'Offline'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">{device.tags?.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
