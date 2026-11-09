import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Clock, Calendar } from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';

export default function Barbers() {
  const { barbers } = useBarberStore();
  const activeBarbers = barbers.filter((b) => b.active);

  return (
    <section id="barberos" className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Maestros de la Navaja</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF6EE] tracking-tight">
            Artistas del Estilo Masculino
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400 font-light">
            Cada uno de nuestros profesionales cuenta con más de un lustro de trayectoria y perfeccionamiento en academias de referencia mundial.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {activeBarbers.map((barber) => (
            <div
              key={barber.id}
              className="luxury-panel-interactive overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo with Overlay */}
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={barber.photoUrl}
                    alt={barber.name}
                    className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/20" />

                  {/* Rating Tag */}
                  <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-[#FAF6EE]">
                    <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                    <span className="font-semibold">{barber.rating}</span>
                    <span className="text-gray-400 text-[10px]">({barber.reviewsCount})</span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-6">
                  <h3 className="font-serif-luxury text-xl font-bold text-[#FAF6EE] group-hover:text-[#C5A059] transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold mt-1">
                    {barber.role}
                  </p>

                  <p className="mt-3 text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                    {barber.bio}
                  </p>

                  {/* Specialties */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                      Especialidades:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {barber.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-md border border-white/5 font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Jornada: {barber.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  to={`/reservar?barberId=${barber.id}`}
                  className="btn-luxury-secondary w-full text-center"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Reservar con él</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
