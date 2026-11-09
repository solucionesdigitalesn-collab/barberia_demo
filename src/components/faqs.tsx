import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: '¿Es imprescindible reservar con cita previa o aceptan visitas espontáneas?',
    a: 'Recomendamos encarecidamente reservar a través de esta plataforma para garantizar tu franja horaria sin esperas. Si acudes sin cita, te atenderemos con gusto siempre que exista una cancelación o sillón disponible en ese momento.',
  },
  {
    q: '¿Puedo elegir específicamente el maestro barbero de mi preferencia?',
    a: 'Por supuesto. Al iniciar tu reserva podrás seleccionar tanto el barbero de tu confianza como la opción de primer barbero disponible según tu conveniencia de horario.',
  },
  {
    q: '¿Qué ocurre si necesito cancelar o modificar la hora de mi cita?',
    a: 'Puedes reprogramar o cancelar tu cita con hasta 2 horas de antelación sin ningún cargo comunicándote por WhatsApp o llamándonos directamente.',
  },
  {
    q: '¿Qué productos utilizan en el afeitado y cuidado capilar?',
    a: 'Trabajamos en exclusiva con marcas de referencia como Baxter of California, Acqua di Parma y aceites botánicos orgánicos libres de parabenos y sulfatos para el máximo respeto cutáneo.',
  },
  {
    q: '¿Qué incluye la cortesía de la casa?',
    a: 'Todos nuestros clientes tienen a su disposición sin coste café espresso italiano de tostado medio, agua con gas helada o degustación de whisky escocés de malta única en nuestra zona lounge.',
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#FAF6EE] tracking-tight">
            Respuestas para tu Visita
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="luxury-panel overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 text-white hover:text-[#C5A059] transition-colors"
                >
                  <span className="font-serif-luxury text-base sm:text-lg font-medium">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A059] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-300 font-light leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
