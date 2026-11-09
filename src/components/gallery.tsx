import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Eye, X, ArrowRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'fade' | 'clasico' | 'barba' | 'ritual';
  image: string;
  author: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Mid Skin Fade & Crop Francés Texturizado',
    category: 'fade',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=900',
    author: 'Mateo "Blade" Silva',
    description: 'Degradado limpio a navaja con textura superior irregular para volumen orgánico.',
  },
  {
    id: 'g-2',
    title: 'Ritual Tradicional con Navaja Kamisori',
    category: 'ritual',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=900',
    author: 'Marcos Vance',
    description: 'Toallas al vapor con aceites esenciales de eucalipto y afeitado apurado al ras.',
  },
  {
    id: 'g-3',
    title: 'Pompadour Ejecutivo con Tijera Japonesa',
    category: 'clasico',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=900',
    author: 'Julián Rossi',
    description: 'Corte señorial con volumen pulido y peinado lateral clásico sin brillos excesivos.',
  },
  {
    id: 'g-4',
    title: 'Esculpido Geométrico de Barba & Contorno',
    category: 'barba',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=900',
    author: 'Marcos Vance',
    description: 'Simetría perfecta trazada a navaja con degradación gradual en las patillas.',
  },
  {
    id: 'g-5',
    title: 'Low Taper Fade & Texturizado Ondulado',
    category: 'fade',
    image: 'https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&q=80&w=900',
    author: 'Mateo "Blade" Silva',
    description: 'Transición sutil en nuca y patillas preservando la densidad natural del cabello.',
  },
  {
    id: 'g-6',
    title: 'Herramientas de Precisión en Acero Damasco',
    category: 'ritual',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=900',
    author: 'Diego Alarcón',
    description: 'Instrumentos forjados artesanalmente para cortes sin tracción y máxima delicadeza.',
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'Todo el Lookbook' },
    { id: 'fade', label: 'Degradados Fade' },
    { id: 'clasico', label: 'Estilos Clásicos' },
    { id: 'barba', label: 'Barba Esculpida' },
    { id: 'ritual', label: 'Rituales & Detalles' },
  ];

  const filtered =
    activeCategory === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="galeria" className="py-24 bg-[#09090C] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Lookbook & Trabajos Reales</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF6EE] tracking-tight">
            Galería de Acabados Impecables
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400 font-light">
            Inspiración para tu próxima cita. Obras realizadas en nuestros sillones por los maestros barberos del club.
          </p>

          {/* Smooth Category Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#C5A059] text-[#09090C] font-bold shadow-md shadow-[#C5A059]/25 scale-[1.02]'
                    : 'bg-white/5 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="luxury-panel-interactive h-80 overflow-hidden cursor-pointer relative group p-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-[#C5A059]" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  {item.author}
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-white mt-1 group-hover:text-[#E2C582] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-light mt-1 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full luxury-panel overflow-hidden border border-[#C5A059]/30"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-gray-300 hover:text-white border border-white/10"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[55vh] overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                  Maestro: {selectedPhoto.author}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-gray-300 font-light mt-1">
                  {selectedPhoto.description}
                </p>
              </div>

              <Link
                to="/reservar"
                onClick={() => setSelectedPhoto(null)}
                className="btn-luxury-primary shrink-0"
              >
                <span>Reservar este Estilo</span>
                <ArrowRight className="w-4 h-4 text-[#09090C]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
