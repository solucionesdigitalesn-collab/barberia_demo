import React from 'react';
import { Award, Star, Users, CheckCircle } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Award,
      value: '14+',
      label: 'Años de Maestría',
      desc: 'Técnicas aprendidas en Milán y Londres',
    },
    {
      icon: Star,
      value: '4.98',
      label: 'Calificación Media',
      desc: 'Más de 850 clientes fidelizados en el club',
    },
    {
      icon: Users,
      value: '15.000+',
      label: 'Rituales de Precisión',
      desc: 'Cortes, perfilados y tratamientos de autor',
    },
    {
      icon: CheckCircle,
      value: '100%',
      label: 'Puntualidad en Citas',
      desc: 'Respeto absoluto por tu tiempo, sin demoras',
    },
  ];

  return (
    <section className="bg-[#0D0D12] py-14 border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="luxury-panel p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-3">
                <s.icon className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white block">
                {s.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold mt-1 block">
                {s.label}
              </span>
              <p className="text-[11px] text-gray-400 font-light mt-1 max-w-[190px]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
