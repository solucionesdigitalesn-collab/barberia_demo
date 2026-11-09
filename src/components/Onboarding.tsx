import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CalendarDays,
  Check,
  Crown,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

interface OnboardingProps {
  onSkip: () => void;
  onFinish: () => void;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -64 : 64, opacity: 0 }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/* -------------------------------------------------------------------------- */
/*  Slide 1 - Agenda & Clientes                                                */
/* -------------------------------------------------------------------------- */

const AGENDA = [
  {
    name: 'Rodrigo Méndez',
    service: 'Fade + perfilado de barba',
    time: '10:30',
    avatar: 'https://i.pravatar.cc/96?img=12',
    status: 'Confirmado',
    tone: 'emerald',
  },
  {
    name: 'Ignacio Larrea',
    service: 'Ritual de toallas calientes',
    time: '11:15',
    avatar: 'https://i.pravatar.cc/96?img=33',
    status: 'Pendiente',
    tone: 'amber',
  },
  {
    name: 'Héctor Valverde',
    service: 'Afeitado imperial con navaja',
    time: '12:00',
    avatar: 'https://i.pravatar.cc/96?img=5',
    status: 'Confirmado',
    tone: 'emerald',
  },
];

function AgendaVisual({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-[#C5A059]/10 blur-2xl" aria-hidden />
      <div className="relative rounded-3xl border border-white/10 bg-[#111116]/80 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059]">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Agenda de hoy</p>
              <p className="text-[11px] text-gray-400">Miércoles, 14 de mayo</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            3 citas
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {AGENDA.map((item, i) => (
            <motion.div
              key={item.name}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-[#C5A059]/30"
            >
              <img
                src={item.avatar}
                alt={item.name}
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/15"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{item.name}</p>
                <p className="truncate text-[11px] text-gray-400">{item.service}</p>
              </div>
              <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <span className="font-mono text-[11px] font-semibold tabular-nums text-gray-300">
                  {item.time}
                </span>
                <span
                  className={
                    item.tone === 'emerald'
                      ? 'inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300'
                      : 'inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300'
                  }
                >
                  <span
                    className={
                      item.tone === 'emerald'
                        ? 'h-1 w-1 rounded-full bg-emerald-400'
                        : 'h-1 w-1 rounded-full bg-amber-400'
                    }
                  />
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#C5A059]/20 bg-[#C5A059]/[0.06] px-3.5 py-2.5">
          <span className="text-[11px] text-gray-300">Reserva rápida desde el móvil</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C5A059]">
            <Scissors className="h-3.5 w-3.5" />
            <span>Nueva cita</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Slide 2 - Marketing & Ofertas                                              */
/* -------------------------------------------------------------------------- */

function CatalogVisual({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-[#C5A059]/10 blur-2xl" aria-hidden />
      <div className="relative rounded-3xl border border-white/10 bg-[#111116]/80 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Catálogo de servicios</p>
              <p className="text-[11px] text-gray-400">Promociones activas</p>
            </div>
          </div>
          <span className="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E2C582]">
            En vivo
          </span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-4 overflow-hidden rounded-2xl border border-white/20 p-4"
          style={{
            background:
              'linear-gradient(135deg, #E6CB8E 0%, #C5A059 48%, #9A7730 100%)',
          }}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" aria-hidden />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#09090C]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#161009]">
                <Crown className="h-3 w-3" />
                <span>Pack Ejecutivo</span>
              </span>
              <p className="mt-2 font-serif-luxury text-lg font-semibold leading-tight text-[#141009]">
                Corte + Barba + Ritual
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#3a2c12]">
                Reserva hoy y ahorra en tu primera visita
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border border-[#141009]/20 bg-[#09090C]/10">
              <span className="text-[16px] font-bold leading-none text-[#141009]">-25%</span>
              <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#3a2c12]">
                Dto.
              </span>
            </div>
          </div>
        </motion.div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { icon: Scissors, name: 'Corte Signature', price: '28 €', was: '35 €', badge: '-20%' },
            { icon: Sparkles, name: 'Ritual de Barba', price: '22 €', was: null, badge: 'Top' },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C5A059]/25 bg-[#C5A059]/10 text-[#C5A059]">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <span className="rounded-full border border-[#C5A059]/30 px-2 py-0.5 text-[9px] font-bold text-[#E2C582]">
                  {item.badge}
                </span>
              </div>
              <p className="mt-3 text-[12px] font-semibold text-white">{item.name}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-sm font-semibold text-[#E2C582] tabular-nums">
                  {item.price}
                </span>
                {item.was && (
                  <span className="text-[10px] text-gray-500 line-through">{item.was}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
          <span className="text-[11px] text-gray-300">Comparte tu catálogo</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C5A059]">
            <span>Promocionar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Slide 3 - Control operativo                                                */
/* -------------------------------------------------------------------------- */

const TEAM = [
  { name: 'Marcos Vance', role: 'Master Barber', value: '642 €', avatar: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Julián Rossi', role: 'Senior Stylist', value: '418 €', avatar: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Mateo Duarte', role: 'Barber', value: '224 €', avatar: 'https://i.pravatar.cc/80?img=60' },
];

function DashboardVisual({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-[#C5A059]/10 blur-2xl" aria-hidden />
      <div className="relative rounded-3xl border border-white/10 bg-[#111116]/80 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Resumen de hoy</p>
              <p className="text-[11px] text-gray-400">Panel de gerencia</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
            <TrendingUp className="h-3 w-3" />
            <span>+12%</span>
          </span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 rounded-2xl border border-[#C5A059]/20 bg-[#C5A059]/[0.06] p-4"
        >
          <p className="text-[11px] uppercase tracking-wider text-gray-400">Ingresos del día</p>
          <div className="mt-1 flex items-end justify-between">
            <span className="font-mono text-3xl font-semibold tabular-nums text-white">1.284 €</span>
            <span className="text-[11px] text-gray-400">26 citas</span>
          </div>
        </motion.div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Ticket medio</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#E2C582]">49,40 €</p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Ocupación</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#E2C582]">87%</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-300">
              <Users className="h-3.5 w-3.5 text-[#C5A059]" />
              <span>Rendimiento del equipo</span>
            </span>
            <span className="text-[10px] text-gray-500">Hoy</span>
          </div>
          <div className="mt-2.5 space-y-2">
            {TEAM.map((member) => (
              <div key={member.name} className="flex items-center gap-2.5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  loading="lazy"
                  className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-white">{member.name}</p>
                  <p className="truncate text-[9px] uppercase tracking-wider text-gray-500">
                    {member.role}
                  </p>
                </div>
                <span className="font-mono text-[11px] font-semibold tabular-nums text-[#E2C582]">
                  {member.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-300">
            <Boxes className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Cera mate texturizante</span>
          </span>
          <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
            Quedan 3
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Slide content                                                              */
/* -------------------------------------------------------------------------- */

interface Slide {
  id: string;
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
  Visual: React.ComponentType<{ reduce: boolean }>;
}

const SLIDES: Slide[] = [
  {
    id: 'agenda',
    icon: CalendarDays,
    label: 'Agenda y clientes',
    title: 'Optimiza tu Agenda y Clientes',
    description:
      'Simplifica el registro de tus clientes, reserva citas en tiempo real y lleva un seguimiento detallado del historial de cada servicio sin complicaciones.',
    Visual: AgendaVisual,
  },
  {
    id: 'marketing',
    icon: Sparkles,
    label: 'Marketing y ventas',
    title: 'Impulsa tus Servicios y Ofertas',
    description:
      'Promociona tus cortes, tratamientos y paquetes especiales. Atrae nuevos clientes con catálogos visuales y promociones exclusivas para tu negocio.',
    Visual: CatalogVisual,
  },
  {
    id: 'operaciones',
    icon: TrendingUp,
    label: 'Operaciones y equipo',
    title: 'Control Total de tu Equipo y Barbería',
    description:
      'Administra comisiones, turnos de barberos, inventario de productos y métricas financieras clave en un solo panel centralizado.',
    Visual: DashboardVisual,
  },
];

/* -------------------------------------------------------------------------- */
/*  Onboarding                                                                 */
/* -------------------------------------------------------------------------- */

export default function Onboarding({ onSkip, onFinish }: OnboardingProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);

  const isLast = index === SLIDES.length - 1;
  const active = SLIDES[index];

  const goTo = useCallback(
    (target: number) => {
      setDirection(target >= index ? 1 : -1);
      setIndex(Math.max(0, Math.min(SLIDES.length - 1, target)));
    },
    [index]
  );

  const goNext = useCallback(() => {
    if (index === SLIDES.length - 1) {
      onFinish();
      return;
    }
    setDirection(1);
    setIndex((prev) => Math.min(SLIDES.length - 1, prev + 1));
  }, [index, onFinish]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, onSkip]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    containerRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -90 || info.velocity.x < -550) {
      goNext();
    } else if (info.offset.x > 90 || info.velocity.x > 550) {
      goPrev();
    }
  };

  const variants = useMemo(() => (reduce ? fadeVariants : slideVariants), [reduce]);
  const Visual = active.Visual;
  const ActiveIcon = active.icon;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#08080A] text-[#FAF6EE] outline-none"
    >
      {/* Ambient gold glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[22rem] left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#C5A059]/[0.10] blur-[130px]" />
        <div className="absolute -bottom-[16rem] -right-[10rem] h-[34rem] w-[34rem] rounded-full bg-[#C5A059]/[0.06] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Ir a la diapositiva anterior"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 transition-colors hover:border-[#C5A059]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/60"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C5A059]/35 bg-gradient-to-b from-[#E6CB8E]/20 to-transparent text-[#C5A059] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Scissors className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="font-serif-luxury text-sm font-semibold tracking-[0.18em] text-[#FAF6EE]">
                AUREUM
              </p>
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#C5A059]/80">
                Barber Club
              </p>
            </div>
          </div>
        </div>

        <span className="hidden rounded-full border border-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 sm:inline-flex">
          Guía rápida
        </span>
      </header>

      {/* Segmented progress */}
      <div className="relative z-10 mx-auto mt-5 w-full max-w-6xl px-5 sm:mt-6 sm:px-8">
        <div className="flex gap-2" role="tablist" aria-label="Progreso del onboarding">
          {SLIDES.map((slide, i) => {
            const state = i < index ? 'done' : i === index ? 'active' : 'idle';
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Ir a ${slide.label}`}
                onClick={() => goTo(i)}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/60"
              >
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-[#9A7730] via-[#C5A059] to-[#E2C582]"
                  initial={false}
                  animate={{ width: state === 'idle' ? '0%' : '100%' }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide area */}
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-start overflow-y-auto px-5 py-6 sm:px-8 lg:items-center">
        <div className="relative w-full py-2 lg:py-0">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={handleDragEnd}
                className="grid cursor-grab gap-8 active:cursor-grabbing lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14"
              >
                <div className="order-2 lg:order-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E2C582]">
                    <ActiveIcon className="h-3.5 w-3.5" />
                    <span>{active.label}</span>
                  </span>

                  <h1
                    id="onboarding-title"
                    className="mt-5 font-serif-luxury text-3xl font-semibold leading-[1.08] tracking-tight text-[#FAF6EE] sm:text-4xl lg:text-[2.9rem]"
                  >
                    {active.title}
                  </h1>

                  <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-gray-400 sm:text-[15px]">
                    {active.description}
                  </p>

                  <div className="mt-6 hidden items-center gap-2 text-[11px] text-gray-500 sm:flex">
                    <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
                      ←
                    </kbd>
                    <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
                      →
                    </kbd>
                    <span>Navega con el teclado o desliza</span>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <Visual reduce={reduce} />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={onSkip}
              className="rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-[#C5A059] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/60"
            >
              Saltar
            </button>
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="Diapositivas">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Diapositiva ${i + 1}: ${slide.label}`}
                onClick={() => goTo(i)}
                className="group flex h-6 items-center focus-visible:outline-none"
              >
                <span
                  className={
                    i === index
                      ? 'block h-2 w-7 rounded-full bg-gradient-to-r from-[#9A7730] to-[#E2C582] transition-all duration-300'
                      : 'block h-2 w-2 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/40'
                  }
                />
              </button>
            ))}
          </div>

          <div className="justify-self-end">
            <button
              type="button"
              onClick={goNext}
              className="btn-luxury-primary !gap-2 !rounded-xl !px-5 !py-3 !text-xs font-bold shadow-[0_10px_30px_-8px_rgba(197,160,89,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080A]"
            >
              {isLast ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="whitespace-nowrap">Entrar al Dashboard</span>
                </>
              ) : (
                <>
                  <span className="whitespace-nowrap">Siguiente</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
