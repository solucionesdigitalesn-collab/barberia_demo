import React from 'react';
import { ShieldCheck, Flame, Coffee, Scissors } from 'lucide-react';

export default function About() {
  return (
    <section id="filosofia" className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Natural Photo Composition */}
          <div className="lg:col-span-5 relative">
            <div className="luxury-panel p-3 overflow-hidden border border-[#C5A059]/30">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=900"
                  alt="Ritual artesanal de cuidado"
                  className="w-full h-full object-cover filter contrast-110"
                />
              </div>
            </div>

            {/* Overlapping Floating Luxury Pill */}
            <div className="absolute -bottom-6 -right-3 sm:-right-6 luxury-panel p-5 max-w-[260px] border border-[#C5A059]/40 shadow-2xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] block mb-1">
                Atención Sin Prisas
              </span>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Reservamos un mínimo de 45 a 75 minutos sin interrupciones por cada servicio de autor.
              </p>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
              <Scissors className="w-3.5 h-3.5" />
              <span>Nuestra Filosofía</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF6EE] tracking-tight leading-[1.15]">
              Más que un corte, un <span className="gold-gradient-text italic font-normal">ritual de afirmación</span> y sosiego.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              En una época dominada por la prisa y la estandarización mecánica, AUREUM Barber Club nace en el distinguido barrio de Salamanca como una declaración de principios: devolver a la peluquería masculina su condición de arte sosegado, preciso y noble.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="luxury-panel p-4">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] mb-2" />
                <h4 className="font-serif-luxury text-base font-bold text-white mb-1">Navajas Kamisori</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Hojas templadas al carbono y desinfección UV de grado médico.
                </p>
              </div>

              <div className="luxury-panel p-4">
                <Flame className="w-5 h-5 text-[#C5A059] mb-2" />
                <h4 className="font-serif-luxury text-base font-bold text-white mb-1">Vapor Botánico</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Toallas húmedas con esencias puras de cedro, eucalipto y sándalo.
                </p>
              </div>

              <div className="luxury-panel p-4">
                <Coffee className="w-5 h-5 text-[#C5A059] mb-2" />
                <h4 className="font-serif-luxury text-base font-bold text-white mb-1">Club & Bar</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Espresso de finca o selección de whiskies de cortesía.
                </p>
              </div>
            </div>

            {/* Founder signature line */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="font-serif-luxury text-base font-bold text-white">Alexander Sterling & Marcos Vance</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                  Fundadores • AUREUM Barber Club
                </p>
              </div>
              <span className="font-serif-luxury italic text-xl text-[#C5A059]/80 hidden sm:inline">
                "Distinctionis Ars"
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
