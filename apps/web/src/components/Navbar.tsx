'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '', key: 'nav.store' },
  { href: 'devices', key: 'nav.devices' },
  { href: 'developer', key: 'nav.developer' },
  { href: 'admin', key: 'nav.admin' },
  { href: 'pricing', key: 'nav.pricing' },
];

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold">
          Yapay Zeka Store
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, key }) => {
            const target = `/${locale}/${href}`.replace(/\/$/, '/');
            const active = pathname === target || (href === '' && pathname === `/${locale}`);
            return (
              <Link
                key={href}
                href={href === '' ? `/${locale}` : `/${locale}/${href}`}
                className={clsx('text-sm transition hover:text-indigo-300', active && 'text-indigo-400 font-semibold')}
              >
                {t(key)}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
