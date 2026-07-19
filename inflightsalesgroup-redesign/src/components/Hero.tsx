import { useEffect, useState } from 'react';
import { PlaneTakeoff } from 'lucide-react';

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 z-20 flex flex-col items-center px-6 text-center transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ top: 120 }}
      >
        <h1
          className="text-ink"
          style={{
            fontSize: 'clamp(40px, 5.4vw, 72px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontWeight: 400,
          }}
        >
          Four decades airborne.
        </h1>
        <h1
          style={{
            fontSize: 'clamp(40px, 5.4vw, 72px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            color: 'var(--color-ink-faint)',
          }}
        >
          Retail our airline partners trust.
        </h1>
      </div>

      <div
        className={`fixed inset-x-0 z-20 flex flex-col items-center gap-6 px-6 transition-all duration-1000 delay-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ bottom: 56 }}
      >
        <p className="max-w-[620px] text-[15px] leading-relaxed text-center">
          <span className="text-ink">
            Since 1982, Inflight Sales Group has powered duty-free, buy-on-board, and pre-order
            retail for the world&apos;s airlines.
          </span>
          <span className="text-ink-faint"> Today we partner with 33 carriers across four continents.</span>
        </p>

        <a
          href="#solutions"
          className="rounded-full px-8 py-3.5 text-[15px] font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 32px 4px rgba(184,134,63,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Explore our solutions
        </a>

        <div className="flex items-center gap-2 text-ink-soft">
          <PlaneTakeoff size={13} strokeWidth={1.5} />
          <span className="text-[11px] font-medium tracking-[0.14em]">
            33 AIRLINES. 4 CONTINENTS. SINCE 1982.
          </span>
        </div>
      </div>
    </>
  );
}
