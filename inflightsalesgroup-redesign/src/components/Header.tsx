const NAV_LINKS = ['SOLUTIONS', 'RESULTS', 'INSIGHTS', 'CONTACT'];

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 py-8">
      <div className="text-[17px] font-semibold tracking-tight text-ink">
        Inflight Sales Group
      </div>

      <nav className="glass-pill hidden md:flex items-center gap-1 rounded-full px-2 py-2">
        {NAV_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            className="px-4 py-1.5 rounded-full text-[11px] font-medium tracking-[0.12em] text-ink-soft hover:text-ink transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className="glass-pill rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-ink-soft hover:text-ink transition-colors duration-200"
      >
        PARTNER WITH US
      </a>
    </header>
  );
}
