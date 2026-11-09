import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X, Shield, Calendar, ArrowRight } from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config, authUser } = useBarberStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Maestros', href: '/#barberos' },
    { name: 'Lookbook', href: '/#galeria' },
    { name: 'Filosofía', href: '/#filosofia' },
    { name: 'Ubicación', href: '/#ubicacion' },
    { name: 'Opiniones', href: '/#opiniones' },
  ];

  return (
    <>
      {/* Top Subtle Announcement Bar */}
      {config.announcement.enabled && (
        <div className="bg-[#101015] border-b border-white/[0.06] text-[#E2C582] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          <span>{config.announcement.text}</span>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#09090C]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50 py-3.5'
            : 'bg-[#09090C]/60 backdrop-blur-md border-b border-white/[0.04] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo with Smooth Squircle Icon */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C1C26] to-[#121217] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:border-[#C5A059] transition-all shadow-md shadow-[#C5A059]/10">
              <Scissors className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-[#FAF6EE] group-hover:text-[#C5A059] transition-colors leading-none">
                AUREUM
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-medium mt-1">
                Barber Club • Madrid
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-[#C5A059] transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C5A059] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Staff / Demo Access Link */}
            {authUser ? (
              <Link
                to={authUser.role === 'admin' ? '/admin' : `/barbero/${authUser.barberId || 'barber-1'}`}
                className="btn-luxury-secondary !py-2 !px-3.5 !text-xs !rounded-xl"
                title={`Sesión activa: ${authUser.name}`}
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{authUser.role === 'admin' ? 'Gerencia' : 'Gestión de Clientes'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                Staff / Demo
              </Link>
            )}

            {/* Book Appointment CTA with native luxury button */}
            <Link
              to="/reservar"
              className="btn-luxury-primary"
            >
              <Calendar className="w-3.5 h-3.5 text-[#09090C]" />
              <span>Reservar Cita</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/reservar"
              className="btn-luxury-primary !py-2 !px-3.5 !text-xs !rounded-lg"
            >
              <span>Cita</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white bg-[#14141B] border border-white/10"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0D0D12]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 pt-4 pb-6 mt-3 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-200 py-2.5 border-b border-white/[0.04] hover:text-[#C5A059]"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/reservar"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-luxury-primary w-full text-center"
              >
                <Calendar className="w-4 h-4 text-[#09090C]" />
                <span>Reservar Cita Online</span>
              </Link>

              <Link
                to={authUser ? (authUser.role === 'admin' ? '/admin' : `/barbero/${authUser.barberId || 'barber-1'}`) : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-luxury-secondary w-full text-center !text-xs"
              >
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span>{authUser ? `Panel (${authUser.name})` : 'Acceso Administrador & Barberos'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
