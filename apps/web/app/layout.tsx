import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'AI Marketplace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
