import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Check, Sparkles, ArrowRight, Scissors } from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';

export default function Services() {
  const { services, config } = useBarberStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Servicios' },
    { id: 'combos_vip', label: 'Combos VIP & Experiencias' },
    { id: 'cortes', label: 'Cortes de Autor' },
    { id: 'barba', label: 'Rituales de Barba' },
    { id: 'tratamientos', label: 'Tratamientos & Spa' },
  ];

  const activeServices = services.filter((s) => s.active);

  const filteredServices =
    selectedCategory === 'all'
      ? activeServices
      : activeServices.filter((s) => s.category === selectedCategory);

  return (
    <section id="servicios" className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
            <Scissors className="w-3.5 h-3.5" />
            <span>Carta de Servicios Exclusivos</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF6EE] tracking-tight">
            Perfección en Cada Detalle
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400 font-light">
            Seleccionamos técnicas clásicas europeas y productos orgánicos de la más alta gama para garantizar un resultado estético superior.
          </p>

          {/* Native Smooth Category Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A059] text-[#09090C] shadow-lg shadow-[#C5A059]/25 font-bold scale-[1.02]'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid with Natural Luxury Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`luxury-panel-interactive flex flex-col justify-between overflow-hidden group ${
                service.popular ? 'ring-1 ring-[#C5A059]/40' : ''
              }`}
            >
              <div>
                {/* Image */}
                {service.image && (
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/20" />

                    {service.popular && (
                      <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059] text-[#09090C] text-[11px] font-bold uppercase tracking-wider shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>{service.tag || 'Destacado'}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif-luxury text-xl font-bold text-[#FAF6EE] group-hover:text-[#C5A059] transition-colors leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 my-3">
                    <span className="font-serif-luxury text-2xl font-bold text-white">
                      {config.currencySymbol}{service.price}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{service.durationMinutes} min</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                    <p className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold">
                      El ritual incluye:
                    </p>
                    {service.includes.map((inc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  to={`/reservar?serviceId=${service.id}`}
                  className="btn-luxury-secondary w-full text-center"
                >
                  <span>Reservar este Servicio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
