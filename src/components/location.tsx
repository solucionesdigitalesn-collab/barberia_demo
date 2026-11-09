import React from 'react';
import { MapPin, Clock, ExternalLink, MessageSquare, Coffee, Wine, Sparkles, Wifi } from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';

export default function Location() {
  const { config } = useBarberStore();

  const amenities = [
    { icon: Coffee, title: 'Café de Finca Gratuito', desc: 'Espresso italiano recién molido' },
    { icon: Wine, title: 'Whisky Bar de Cortesía', desc: 'Selección de Single Malts escoceses' },
    { icon: Sparkles, title: 'Toallas al Vapor', desc: 'Aromaterapia relajante antes y después' },
    { icon: Wifi, title: 'Fibra Óptica & Confort', desc: 'Espacio acondicionado para desconectar' },
  ];

  return (
    <section id="ubicacion" className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Schedule & Amenities */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>Horarios & Experiencia</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF6EE] tracking-tight">
                El Santuario en Salamanca
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-400 font-light leading-relaxed">
                Ubicado en el exclusivo distrito de Salamanca, nuestro salón está pensado para brindarte un paréntesis de calma y sofisticación en tu jornada.
              </p>
            </div>

            {/* Schedule Panel */}
            <div className="luxury-panel p-6 sm:p-7 border border-[#C5A059]/25">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>Horarios de Atención</span>
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Abierto Hoy</span>
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300">Lunes a Viernes</span>
                  <span className="font-semibold text-white font-mono">{config.scheduleWeekday.replace('Lunes a Viernes: ', '')}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5">
                  <span className="text-gray-300">Sábados</span>
                  <span className="font-semibold text-white font-mono">{config.scheduleSaturday.replace('Sábados: ', '')}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5">
                  <span className="text-gray-300">Domingos</span>
                  <span className="text-[#C5A059] text-xs italic">Bajo cita previa exclusiva</span>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="luxury-panel p-4 flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="luxury-panel overflow-hidden border border-white/10">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#161620]">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                  alt="Ubicación AUREUM"
                  className="w-full h-full object-cover filter contrast-125 brightness-75 saturate-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/30" />

                {/* Map Pin Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#09090C] flex items-center justify-center shadow-xl shadow-[#C5A059]/50 animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="mt-2 bg-[#09090C]/90 border border-[#C5A059]/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xl text-center">
                    <p className="font-serif-luxury text-xs font-bold text-white">AUREUM Barber Club</p>
                    <p className="text-[10px] text-[#C5A059]">Salamanca, Madrid</p>
                  </div>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">{config.address}</p>
                    <p className="text-xs text-gray-400">{config.city} • Metro Gregorio Marañón / Rubén Darío</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-luxury-primary flex-1 text-center"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-luxury-secondary flex-1 text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
