import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

const ROWS = 9;
const SEATS_PER_SIDE = 3;
const SEAT = 52;
const SEAT_GAP = 13;
const AISLE = 62;
const ROW_GAP = 22;

const SIDE_WIDTH = SEATS_PER_SIDE * SEAT + (SEATS_PER_SIDE - 1) * SEAT_GAP;
const PLANE_WIDTH = SIDE_WIDTH * 2 + AISLE;
const PLANE_HEIGHT = ROWS * SEAT + (ROWS - 1) * ROW_GAP;
const AISLE_X = SIDE_WIDTH + AISLE / 2;

type SeatData = {
  id: string;
  occupied: boolean;
  hasPhone: boolean;
};

function buildSeats(): SeatData[][] {
  const rows: SeatData[][] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 0; r < ROWS; r++) {
    const row: SeatData[] = [];
    for (let s = 0; s < SEATS_PER_SIDE * 2; s++) {
      const occupied = rand() > 0.32;
      row.push({
        id: `${r}-${s}`,
        occupied,
        hasPhone: occupied && rand() > 0.45,
      });
    }
    rows.push(row);
  }
  return rows;
}

function Seat({
  data,
  registerRef,
}: {
  data: SeatData;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const glowDelay = useMemo(() => (Math.random() * 4).toFixed(2), []);
  const glowDuration = useMemo(() => (2.6 + Math.random() * 1.6).toFixed(2), []);
  const flickerDelay = useMemo(() => (Math.random() * 5).toFixed(2), []);

  return (
    <div
      ref={(el) => registerRef(data.id, el)}
      className="relative rounded-[6px] border"
      style={{
        width: SEAT,
        height: SEAT,
        borderColor: 'var(--color-line)',
        background: 'rgba(255,255,255,0.55)',
        transformStyle: 'preserve-3d',
      }}
    >
      {data.occupied && (
        <div
          className="absolute rounded-full"
          style={{
            width: '42%',
            height: '42%',
            top: '29%',
            left: '29%',
            background: 'rgba(20,22,28,0.22)',
          }}
        />
      )}
      {data.occupied && data.hasPhone && (
        <div
          className="phone-glow absolute rounded-full"
          style={
            {
              width: '30%',
              height: '30%',
              top: '34%',
              left: '34%',
              background: 'radial-gradient(circle, rgba(184,134,63,0.9) 0%, rgba(184,134,63,0) 70%)',
              '--glow-delay': `${glowDelay}s`,
              '--glow-duration': `${glowDuration}s`,
            } as React.CSSProperties
          }
        />
      )}
      <div
        className="seatback-screen absolute rounded-[2px]"
        style={
          {
            width: 16,
            height: 10,
            left: '50%',
            marginLeft: -8,
            top: -18,
            background: 'var(--color-navy)',
            transform: 'translateZ(16px)',
            '--flicker-delay': `${flickerDelay}s`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default function IsometricCabin() {
  const seatRows = useMemo(buildSeats, []);
  const seatRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const planeRef = useRef<HTMLDivElement>(null);
  const trolleyRef = useRef<HTMLDivElement>(null);
  const hostessRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * PLANE_WIDTH,
        top: Math.random() * PLANE_HEIGHT + 40,
        duration: 8 + Math.random() * 7,
        delay: Math.random() * 9,
        driftX: (Math.random() - 0.5) * 90,
        driftY: -120 - Math.random() * 100,
        opacity: 0.25 + Math.random() * 0.3,
        size: 2 + Math.random() * 2,
      })),
    [],
  );

  const registerRef = (id: string, el: HTMLDivElement | null) => {
    if (el) seatRefs.current.set(id, el);
    else seatRefs.current.delete(id);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let alive = true;

    // Random "purchase" pulses on occupied seats
    const occupiedIds = seatRows.flat().filter((s) => s.occupied).map((s) => s.id);
    const pulse = () => {
      if (!alive || occupiedIds.length === 0) return;
      const id = occupiedIds[Math.floor(Math.random() * occupiedIds.length)];
      const el = seatRefs.current.get(id);
      if (el) {
        gsap
          .timeline()
          .to(el, {
            backgroundColor: 'rgba(184,134,63,0.5)',
            borderColor: 'rgba(184,134,63,0.9)',
            boxShadow: '0 0 18px 4px rgba(184,134,63,0.55)',
            scale: 1.08,
            duration: 0.35,
            ease: 'power2.out',
          })
          .to(el, {
            backgroundColor: 'rgba(255,255,255,0.55)',
            borderColor: 'var(--color-line)',
            boxShadow: '0 0 0 0 rgba(184,134,63,0)',
            scale: 1,
            duration: 1.1,
            ease: 'power2.inOut',
          });
      }
      setTimeout(pulse, 700 + Math.random() * 1600);
    };
    const startTimer = setTimeout(pulse, 900);

    // Trolley + hostess drifting down the aisle, intermittently
    const runPass = (
      ref: React.RefObject<HTMLDivElement | null>,
      minGap: number,
      maxGap: number,
      duration: number,
    ) => {
      const el = ref.current;
      if (!el) return;
      const forward = Math.random() > 0.5;
      gsap.set(el, {
        top: forward ? -30 : PLANE_HEIGHT + 30,
        opacity: 0,
      });
      const tl = gsap.timeline({
        onComplete: () => {
          if (alive) setTimeout(() => runPass(ref, minGap, maxGap, duration), minGap + Math.random() * (maxGap - minGap));
        },
      });
      tl.to(el, { opacity: 1, duration: 0.6 })
        .to(
          el,
          {
            top: forward ? PLANE_HEIGHT + 30 : -30,
            duration,
            ease: 'sine.inOut',
          },
          0,
        )
        .to(el, { opacity: 0, duration: 0.6 }, duration - 0.6);
    };

    const trolleyTimer = setTimeout(() => runPass(trolleyRef, 6000, 14000, 9), 2000);
    const hostessTimer = setTimeout(() => runPass(hostessRef, 5000, 12000, 6.5), 5500);

    // Subtle mouse parallax on the whole cabin
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 14;
      targetY = ((e.clientY - cy) / cy) * 10;
    };
    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (planeRef.current) {
        gsap.set(planeRef.current, { x: curX, y: curY });
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      clearTimeout(startTimer);
      clearTimeout(trolleyTimer);
      clearTimeout(hostessTimer);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [seatRows]);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: 2200 }}>
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: PLANE_WIDTH * 1.3,
          height: PLANE_WIDTH * 1.3,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(closest-side, rgba(184,134,63,0.06), rgba(184,134,63,0) 70%)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transform: 'translate(-50%, -50%) rotateX(58deg) rotateZ(45deg) scale(1.15)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          ref={planeRef}
          className="relative"
          style={{ width: PLANE_WIDTH, height: PLANE_HEIGHT, transformStyle: 'preserve-3d' }}
        >
          {/* aisle strip */}
          <div
            className="absolute rounded-full"
            style={{
              left: AISLE_X - 20,
              top: -20,
              width: 40,
              height: PLANE_HEIGHT + 40,
              background: 'linear-gradient(180deg, rgba(36,52,74,0.05), rgba(36,52,74,0.1))',
            }}
          />

          <div className="flex flex-col" style={{ gap: ROW_GAP, transformStyle: 'preserve-3d' }}>
            {seatRows.map((row, ri) => (
              <div
                key={ri}
                className="flex"
                style={{ gap: AISLE, transformStyle: 'preserve-3d' }}
              >
                <div className="flex" style={{ gap: SEAT_GAP, transformStyle: 'preserve-3d' }}>
                  {row.slice(0, SEATS_PER_SIDE).map((seat) => (
                    <Seat key={seat.id} data={seat} registerRef={registerRef} />
                  ))}
                </div>
                <div className="flex" style={{ gap: SEAT_GAP, transformStyle: 'preserve-3d' }}>
                  {row.slice(SEATS_PER_SIDE).map((seat) => (
                    <Seat key={seat.id} data={seat} registerRef={registerRef} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* trolley */}
          <div
            ref={trolleyRef}
            className="absolute rounded-[4px]"
            style={{
              left: AISLE_X - 13,
              width: 26,
              height: 15,
              background: 'rgba(36,52,74,0.55)',
              boxShadow: '0 0 10px 2px rgba(36,52,74,0.2)',
              transform: 'translateZ(10px)',
              opacity: 0,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 rounded-t-[4px]"
              style={{ height: 3, background: 'rgba(255,255,255,0.5)' }}
            />
          </div>

          {/* hostess */}
          <div
            ref={hostessRef}
            className="absolute"
            style={{ left: AISLE_X - 15, width: 30, height: 26, transform: 'translateZ(20px)', opacity: 0 }}
          >
            <div
              className="mx-auto rounded-full"
              style={{ width: 10, height: 10, background: 'rgba(184,134,63,0.7)' }}
            />
            <div
              className="mx-auto mt-[3px] rounded-[3px]"
              style={{ width: 16, height: 12, background: 'rgba(36,52,74,0.55)' }}
            />
          </div>

          {/* abstract data particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="data-particle absolute rounded-full"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  background: 'var(--color-gold)',
                  transform: 'translateZ(60px)',
                  '--duration': `${p.duration}s`,
                  '--delay': `${p.delay}s`,
                  '--drift-x': `${p.driftX}px`,
                  '--drift-y': `${p.driftY}px`,
                  '--particle-opacity': p.opacity,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
