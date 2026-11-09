import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Star, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#09090C] pt-6 pb-20">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2200"
          alt="AUREUM Barber Club"
          className="w-full h-full object-cover object-center filter brightness-[0.26] contrast-115 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090C] via-[#09090C]/60 to-[#09090C]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#09090C_80%)] opacity-90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
        {/* Natural Luxury Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161620]/90 border border-[#C5A059]/35 backdrop-blur-md mb-8 shadow-lg shadow-black/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#E2C582]">
            Haute Coiffure & Grooming de Autor • Salamanca, Madrid
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAF6EE] max-w-4xl leading-[1.12]"
        >
          El Arte de la <span className="gold-gradient-text italic font-normal">Precisión</span> & Distinción Masculina
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed"
        >
          Un santuario exclusivo donde la navaja tradicional se funde con el visagismo contemporáneo. Cada visita es un ritual diseñado a tu medida.
        </motion.p>

        {/* Tactile Native Luxury Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            to="/reservar"
            className="btn-luxury-primary w-full sm:w-auto !py-3.5 !px-8 !text-sm"
          >
            <Calendar className="w-4 h-4 text-[#09090C]" />
            <span>Reservar Cita Online</span>
            <ArrowRight className="w-4 h-4 text-[#09090C]" />
          </Link>

          <a
            href="#servicios"
            className="btn-luxury-secondary w-full sm:w-auto !py-3.5 !px-8 !text-sm"
          >
            <span>Carta de Servicios & Precios</span>
          </a>
        </motion.div>

        {/* Native Floating Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left"
        >
          <div className="luxury-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D28] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <Star className="w-5 h-5 fill-[#C5A059]" />
            </div>
            <div>
              <p className="font-serif-luxury text-lg font-bold text-white">4.98 / 5.0</p>
              <p className="text-[11px] text-gray-400">+850 clientes verificados</p>
            </div>
          </div>

          <div className="luxury-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D28] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-luxury text-lg font-bold text-white">100% Citas</p>
              <p className="text-[11px] text-gray-400">Puntualidad sin esperas</p>
            </div>
          </div>

          <div className="luxury-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D28] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-luxury text-lg font-bold text-white">4 Maestros</p>
              <p className="text-[11px] text-gray-400">Milán, Londres y Tokio</p>
            </div>
          </div>

          <div className="luxury-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D28] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <p className="font-serif-luxury text-lg font-bold text-white">Barra VIP</p>
              <p className="text-[11px] text-gray-400">Whisky & café de cortesía</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
