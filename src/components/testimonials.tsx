import React from 'react';
import { Star, Award, CheckCircle2 } from 'lucide-react';
import { INITIAL_REVIEWS } from '../services/mockData';

export default function Testimonials() {
  return (
    <section id="opiniones" className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Opiniones Verificadas</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF6EE] tracking-tight">
            La Voz de los Caballeros
          </h2>

          <div className="mt-5 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <div className="flex gap-1 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
              ))}
            </div>
            <span className="text-xs font-semibold text-white">4.98 de 5 estrellas</span>
            <span className="text-[11px] text-gray-400 border-l border-white/10 pl-3">850+ citas auditadas</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="luxury-panel p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5 text-[#C5A059]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-[#C5A059]/30 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#FAF6EE] truncate">
                      {rev.clientName}
                    </h4>
                    <span title="Cliente verificado">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    </span>
                  </div>
                  <p className="text-[10px] text-[#C5A059] truncate font-medium mt-0.5">
                    {rev.serviceName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
