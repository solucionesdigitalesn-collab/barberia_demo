import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';
import { useToast } from './ui/Toast';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function Footer() {
  const { config, resetAll } = useBarberStore();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('¡Te has suscrito a las invitaciones privadas de AUREUM!', 'success');
      setEmail('');
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restaurar todos los datos simulados de la demo a su estado inicial?')) {
      resetAll();
      showToast('Datos de demostración restaurados con éxito.', 'info');
    }
  };

  return (
    <footer className="bg-[#07070A] text-gray-400 border-t border-white/[0.08] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14141B] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-2xl font-bold tracking-wider text-[#FAF6EE] leading-none">
                  AUREUM
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium mt-1">
                  Barber Club
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              Santuario de la alta barbería masculina en Madrid. Precisión milimétrica, rituales de toallas al vapor y atención distinguida en cada sillón.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#121217] border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#121217] border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Navegación</p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#servicios" className="hover:text-[#C5A059] transition-colors">
                  Servicios & Precios
                </a>
              </li>
              <li>
                <a href="/#barberos" className="hover:text-[#C5A059] transition-colors">
                  Maestros Barberos
                </a>
              </li>
              <li>
                <a href="/#galeria" className="hover:text-[#C5A059] transition-colors">
                  Lookbook de Cortes
                </a>
              </li>
              <li>
                <a href="/#filosofia" className="hover:text-[#C5A059] transition-colors">
                  Nuestra Filosofía
                </a>
              </li>
              <li>
                <a href="/#ubicacion" className="hover:text-[#C5A059] transition-colors">
                  Ubicación & Horarios
                </a>
              </li>
              <li>
                <a href="/#opiniones" className="hover:text-[#C5A059] transition-colors">
                  Opiniones de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Staff Access */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Acceso al Sistema</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/reservar" className="text-[#C5A059] hover:underline font-semibold flex items-center gap-1.5">
                  <span>Reservar Cita Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Portal Staff & Barberos (Demo)</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#C5A059] transition-colors">
                  Panel de Administrador
                </Link>
              </li>
              <li>
                <Link to="/barbero/barber-1" className="hover:text-[#C5A059] transition-colors">
                  Panel de Barbero (Marcos Vance)
                </Link>
              </li>
              <li className="pt-2">
                <button
                  onClick={handleResetData}
                  className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-[#C5A059]" />
                  <span>Restablecer Datos Demo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Club de Caballeros</p>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Recibe invitaciones a degustaciones privadas y disponibilidad prioritaria para vísperas festivas.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico..."
                required
                className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="btn-luxury-primary w-full text-center !py-2.5 !text-xs"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AUREUM Barber Club. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-400 font-mono text-[11px]">
              Demo Frontend 100% interactiva (LocalStorage)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
