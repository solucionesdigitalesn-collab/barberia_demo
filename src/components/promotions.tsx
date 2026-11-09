import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight, Check } from 'lucide-react';

export default function Promotions() {
  return (
    <section className="py-20 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-panel p-8 sm:p-12 relative overflow-hidden border border-[#C5A059]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider text-[#E2C582]">
                <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Membresía para Habituales</span>
              </div>

              <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white leading-tight">
                Plan Mensual <span className="gold-gradient-text italic font-normal">Black Gold</span>
              </h3>

              <p className="text-sm text-gray-300 font-light max-w-2xl leading-relaxed">
                Disfruta de mantenimiento quincenal de corte y barba, prioridad total de reserva en fines de semana y acceso libre a nuestra selecta barra de whiskies japoneses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  <span>2 Cortes de autor + 2 Rituales de barba al mes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  <span>Prioridad de reserva en festivos y fines de semana</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  <span>Descuento del 15% en cosmética capilar y aftershave</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  <span>Invitación a catas privadas de destilados</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="bg-[#14141B] border border-white/10 p-6 rounded-2xl text-center w-full max-w-xs shadow-xl">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">
                  Cuota Mensual
                </span>
                <span className="font-serif-luxury text-4xl font-bold text-white block my-1">
                  89€<span className="text-sm font-normal text-gray-400"> /mes</span>
                </span>
                <p className="text-[11px] text-gray-400 mb-4">Sin permanencia mínima obligatoria</p>

                <Link
                  to="/reservar"
                  className="btn-luxury-primary w-full text-center"
                >
                  <span>Solicitar Cita de Prueba</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#09090C]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
