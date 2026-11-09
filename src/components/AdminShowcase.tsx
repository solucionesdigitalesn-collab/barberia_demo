import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  CalendarDays,
  TrendingUp,
  Users,
  Scissors,
  Settings2,
  ShieldCheck,
  ArrowUpRight,
  LayoutDashboard,
} from 'lucide-react';

/* ─── Feature list ──────────────────────────────────────────── */
const FEATURES = [
  {
    icon: CalendarDays,
    label: 'Agenda en tiempo real',
    desc: 'Visualiza, crea y reagenda citas desde un calendario intuitivo.',
  },
  {
    icon: TrendingUp,
    label: 'Ingresos y estadísticas',
    desc: 'Seguimiento diario de facturación, servicios más demandados y métricas clave.',
  },
  {
    icon: Users,
    label: 'Gestión del equipo',
    desc: 'Administra perfiles de barberos, asigna citas y controla rendimiento.',
  },
  {
    icon: Scissors,
    label: 'Catálogo de servicios',
    desc: 'Edita precios, duración y descripción de cada servicio en segundos.',
  },
  {
    icon: Settings2,
    label: 'Configuración del negocio',
    desc: 'Horarios, mensajes de bienvenida, logo y personalización total.',
  },
  {
    icon: ShieldCheck,
    label: 'Acceso por roles',
    desc: 'Panel exclusivo para el administrador y vistas privadas por barbero.',
  },
];

/* ─── Mini dashboard preview ────────────────────────────────── */
const MOCK_BOOKINGS = [
  { name: 'Carlos R.', service: 'Corte Clásico', time: '10:00', status: 'confirmed' },
  { name: 'Javier M.', service: 'Afeitado Real', time: '11:30', status: 'pending' },
  { name: 'Álvaro P.', service: 'Barba Premium', time: '13:00', status: 'confirmed' },
];

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase
        ${status === 'confirmed'
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}
    >
      {status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
    </span>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function AdminShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  });

  return (
    <section
      ref={ref}
      id="admin-showcase"
      className="relative overflow-hidden py-28 md:py-36 bg-[#06060A]"
    >
      {/* ── Background texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(197,160,89,0.07) 0%, transparent 70%), radial-gradient(ellipse 55% 40% at 10% 100%, rgba(197,160,89,0.04) 0%, transparent 60%)',
        }}
      />

      {/* ── Fine grid overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.p {...fadeUp(0)} className="text-[11px] font-mono tracking-[0.22em] text-[#C5A059] uppercase mb-4">
            Panel de Control · AUREUM
          </motion.p>

          <motion.h2
            {...fadeUp(0.08)}
            className="font-serif-luxury text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.1] font-bold text-white mb-5"
          >
            Ten el control total<br />
            <span className="gold-gradient-text">de tu barbería,</span><br />
            desde un solo lugar.
          </motion.h2>

          <motion.p {...fadeUp(0.16)} className="text-[#9898A6] text-base md:text-lg leading-relaxed max-w-xl">
            Una plataforma de gestión diseñada para la barbería moderna. Reservas, equipo,
            servicios e ingresos — todo centralizado, siempre a la vista.
          </motion.p>
        </div>

        {/* ── Two-column layout ───────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Feature grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                {...fadeUp(0.1 + i * 0.07)}
                className="group relative rounded-2xl p-5 border border-white/[0.07] bg-white/[0.025] hover:border-[#C5A059]/30 hover:bg-white/[0.045] transition-all duration-300"
              >
                <div className="mb-3 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20">
                  <f.icon className="w-4.5 h-4.5 text-[#C5A059]" strokeWidth={1.6} />
                </div>
                <p className="text-sm font-semibold text-white mb-1 leading-snug">{f.label}</p>
                <p className="text-xs text-[#7A7A8A] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Right — Live-preview card */}
          <motion.div {...fadeUp(0.22)} className="relative">
            {/* glow behind card */}
            <div
              aria-hidden
              className="absolute -inset-px rounded-3xl opacity-40 blur-2xl"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.22) 0%, transparent 70%)' }}
            />

            <div className="relative rounded-3xl border border-white/[0.09] bg-[#0D0D12] overflow-hidden shadow-2xl">

              {/* Dashboard topbar */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
                <LayoutDashboard className="w-4 h-4 text-[#C5A059]" strokeWidth={1.6} />
                <span className="text-xs font-semibold text-white/70 tracking-wide">Panel de Administración</span>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]/60" />
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
                {[
                  { label: 'Hoy', value: '12', sub: 'citas' },
                  { label: 'Ingresos', value: '€640', sub: 'estimados' },
                  { label: 'Equipo', value: '4', sub: 'barberos' },
                ].map((k) => (
                  <div key={k.label} className="p-4 text-center">
                    <p className="text-[10px] text-[#6A6A78] uppercase tracking-widest mb-1">{k.label}</p>
                    <p className="text-xl font-bold text-white leading-none">{k.value}</p>
                    <p className="text-[10px] text-[#C5A059] mt-0.5">{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Booking rows */}
              <div className="p-4 space-y-2.5">
                <p className="text-[10px] font-mono tracking-[0.18em] text-[#5A5A68] uppercase mb-3">Próximas citas — Hoy</p>
                {MOCK_BOOKINGS.map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.05]"
                  >
                    {/* Avatar initial */}
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/25 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#C5A059]">{b.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/90 truncate">{b.name}</p>
                      <p className="text-[10px] text-[#6A6A78] truncate">{b.service}</p>
                    </div>
                    <span className="text-[11px] font-mono text-[#C5A059] mr-1">{b.time}</span>
                    <StatusPill status={b.status} />
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-4 pb-4">
                <div className="rounded-xl bg-[#C5A059]/[0.07] border border-[#C5A059]/15 px-4 py-3 text-center">
                  <p className="text-[11px] text-[#C5A059]/80">
                    Esto es solo una vista previa — el panel completo está disponible ahora.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.55, duration: 0.4, ease: 'backOut' }}
              className="absolute -top-4 -right-4 hidden lg:flex items-center gap-2 rounded-2xl bg-[#1A1A24] border border-[#C5A059]/30 px-3.5 py-2.5 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white/80">Demo en vivo</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── CTA row ─────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.42)}
          className="mt-14 md:mt-18 flex flex-col sm:flex-row items-center gap-4 justify-center border-t border-white/[0.06] pt-12"
        >
          <Link
            to="/admin"
            className="btn-luxury-primary w-full sm:w-auto justify-center !px-8 !py-3.5 !text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Explorar el panel ahora</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="btn-luxury-secondary w-full sm:w-auto justify-center !px-8 !py-3.5 !text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Acceso demo de administrador</span>
          </Link>
        </motion.div>

        {/* ── Footnote ─────────────────────────────────────────── */}
        <motion.p {...fadeUp(0.52)} className="mt-5 text-center text-[11px] text-[#444450]">
          Sin registro · Sin tarjeta · Todos los datos son simulados y se guardan solo en tu dispositivo.
        </motion.p>
      </div>
    </section>
  );
}
