import React from 'react';

type CardProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, children, footer }) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:bg-slate-900" aria-labelledby={title.replace(/\s+/g, '-') + '-title'}>
    <header className="border-b border-slate-200 p-4">
      <h2 id={title.replace(/\s+/g, '-') + '-title'} className="text-lg font-semibold">
        {title}
      </h2>
    </header>
    <div className="p-4 space-y-2">{children}</div>
    {footer ? <footer className="border-t border-slate-200 p-4 text-sm text-slate-600">{footer}</footer> : null}
  </section>
);
