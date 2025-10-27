export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Yapay Zeka Store</span>
        <div className="flex gap-4">
          <a className="hover:text-indigo-300" href="/docs/overview" target="_blank" rel="noreferrer">
            Docs
          </a>
          <a className="hover:text-indigo-300" href="/docs/demo-day" target="_blank" rel="noreferrer">
            Demo Day
          </a>
        </div>
      </div>
    </footer>
  );
}
