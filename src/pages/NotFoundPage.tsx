import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Home, RefreshCw, Scissors, Sparkles } from 'lucide-react';

const REDIRECT_SECONDS = 4;
const EXIT_MS = 640;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SPARKS = Array.from({ length: 18 }, (_, index) => ({
  left: (index * 37 + 9) % 100,
  top: (index * 53 + 13) % 100,
  duration: 4.5 + (index % 5) * 0.9,
  delay: (index % 9) * 0.55,
  size: 2 + (index % 3),
}));

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion() ?? false;

  const [remaining, setRemaining] = useState(REDIRECT_SECONDS);
  const [exiting, setExiting] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const requested = `${location.pathname}${location.search}`;

  useEffect(() => {
    const previous = document.title;
    document.title = '404 · AUREUM Barber Club';
    return () => {
      document.title = previous;
    };
  }, []);

  const goHome = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const startExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    exitTimerRef.current = window.setTimeout(goHome, reduce ? 80 : EXIT_MS);
  }, [goHome, reduce]);

  useEffect(() => {
    if (exiting) return;
    if (remaining <= 0) {
      startExit();
      return;
    }
    const id = window.setTimeout(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [exiting, remaining, startExit]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  const handlePointer = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
    stage.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
    stage.style.setProperty('--mx', `${(x * 16).toFixed(2)}px`);
    stage.style.setProperty('--my', `${(y * 16).toFixed(2)}px`);
  };

  const resetPointer = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--tilt-x', '0deg');
    stage.style.setProperty('--tilt-y', '0deg');
    stage.style.setProperty('--mx', '0px');
    stage.style.setProperty('--my', '0px');
  };

  const ringOffset = CIRCUMFERENCE * (1 - remaining / REDIRECT_SECONDS);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#08080A] text-[#EDEDF0]"
      style={{ minHeight: '100svh' }}
    >
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(197,160,89,0.18),transparent_62%)]" />
        <div className="nf-glow absolute left-[6%] top-[18%] h-72 w-72 rounded-full bg-[#C5A059]/10 blur-[110px]" />
        <div className="nf-glow absolute bottom-[12%] right-[8%] h-80 w-80 rounded-full bg-[#8C6A28]/10 blur-[120px]" />
        <div className="nf-grid absolute inset-0 opacity-70" />
        <div className="nf-scan absolute inset-x-0 top-0 h-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#08080A_92%)]" />

        {SPARKS.map((spark, index) => (
          <span
            key={index}
            className="nf-spark"
            style={{
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              width: spark.size,
              height: spark.size,
              animationDuration: `${spark.duration}s`,
              animationDelay: `${spark.delay}s`,
            }}
          />
        ))}

        <div className="nf-float absolute right-[10%] top-[26%] hidden text-[#C5A059]/20 lg:block">
          <Scissors className="h-20 w-20" strokeWidth={0.7} />
        </div>
        <div className="nf-float absolute bottom-[22%] left-[9%] hidden text-[#C5A059]/15 lg:block" style={{ animationDelay: '1.4s' }}>
          <Sparkles className="h-12 w-12" strokeWidth={1} />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col" style={{ minHeight: '100svh' }}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A059]/40 text-[#C5A059]">
              <Scissors className="h-4 w-4" />
            </span>
            <div className="leading-none">
              <span className="block font-serif-luxury text-sm tracking-[0.28em] text-[#FAF6EE]">AUREUM</span>
              <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">
                Atelier Digital
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-[0.35em] text-white/40 sm:flex">
            <span className="nf-glow h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
            Error 404
          </div>
        </header>

        {/* Main */}
        <main
          className="relative flex flex-1 items-center justify-center px-6 pb-10 pt-2 sm:px-10"
          onMouseMove={handlePointer}
          onMouseLeave={resetPointer}
        >
          <div className="w-full max-w-3xl text-center">
            <div
              className="nf-rise inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E2C582]"
              style={{ animationDelay: '0.05s' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Expediente no encontrado
            </div>

            <div
              ref={stageRef}
              className="relative mx-auto mt-1 w-fit"
              style={
                {
                  '--tilt-x': '0deg',
                  '--tilt-y': '0deg',
                  '--mx': '0px',
                  '--my': '0px',
                  transform:
                    'perspective(1200px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translate3d(var(--mx), var(--my), 0)',
                  transition: reduce ? 'none' : 'transform 120ms ease-out',
                } as React.CSSProperties
              }
            >
              <span
                aria-hidden
                className="nf-echo pointer-events-none absolute inset-0 translate-x-3 translate-y-4 font-cinzel text-[clamp(6.5rem,26vw,19rem)] font-black leading-none"
              >
                404
              </span>
              <span
                aria-hidden
                className="nf-echo pointer-events-none absolute inset-0 -translate-x-4 translate-y-7 font-cinzel text-[clamp(6.5rem,26vw,19rem)] font-black leading-none"
              >
                404
              </span>
              <motion.h1
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="nf-404 relative font-cinzel text-[clamp(6.5rem,26vw,19rem)] font-black leading-[0.9] tracking-tight"
                aria-label="Error 404: página no encontrada"
              >
                404
              </motion.h1>
            </div>

            <h2
              className="nf-rise mx-auto -mt-1 max-w-xl font-serif-luxury text-2xl font-medium leading-tight text-[#FAF6EE] sm:text-3xl"
              style={{ animationDelay: '0.12s' }}
            >
              Esta página no está en el atelier
            </h2>

            <p
              className="nf-rise mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55"
              style={{ animationDelay: '0.18s' }}
            >
              El enlace que buscas se perdió entre navajas y espejos. Te devolvemos al inicio antes
              de que el aroma del bálsamo se enfríe.
            </p>

            <div
              className="nf-rise mt-5 flex justify-center"
              style={{ animationDelay: '0.24s' }}
            >
              <span className="inline-flex max-w-full items-center gap-2 truncate rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] text-white/45">
                <span className="text-[#C5A059]">GET</span>
                <span className="truncate">{requested}</span>
              </span>
            </div>

            <div
              className="nf-rise mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: '0.3s' }}
            >
              <button type="button" onClick={goHome} className="btn-luxury-primary w-full !px-5 !py-3 sm:w-auto">
                <Home className="h-4 w-4" />
                <span>Volver al inicio</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-luxury-secondary w-full !px-5 !py-3 sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Recargar</span>
              </button>
            </div>

            <div
              className="nf-rise mx-auto mt-8 flex w-fit items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-left"
              style={{ animationDelay: '0.36s' }}
            >
              <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 120 120" aria-hidden>
                  <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke="url(#nfRing)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={ringOffset}
                    style={{ transition: reduce ? 'none' : 'stroke-dashoffset 1s linear' }}
                  />
                  <defs>
                    <linearGradient id="nfRing" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E2C582" />
                      <stop offset="100%" stopColor="#8C6A28" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute font-cinzel text-xl font-bold tabular-nums text-[#E2C582]">
                  {remaining}
                </span>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
                  Redirección automática
                </p>
                <p className="mt-1 text-sm text-white/70" aria-live="polite">
                  {exiting ? (
                    'Volviendo al inicio...'
                  ) : (
                    <>
                      Volviendo al inicio en{' '}
                      <span className="font-semibold text-[#E2C582]">{remaining} s</span>
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={startExit}
                  disabled={exiting}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#C5A059] transition-colors hover:text-[#E2C582] disabled:cursor-default disabled:opacity-40"
                >
                  Ir ahora
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] px-6 py-4 text-[9px] uppercase tracking-[0.3em] text-white/25 sm:flex-row sm:px-10">
          <span>AUREUM · Madrid · Salamanca</span>
          <span>Calle de Serrano 42</span>
        </footer>
      </div>

      {/* Cinematic exit wipe */}
      <div aria-hidden className={exiting ? 'nf-wipe nf-wipe--active' : 'nf-wipe'} />
    </div>
  );
}
