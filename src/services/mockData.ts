import { Barber, Service, Review, BusinessConfig, Booking, AuthUser, BookingStatus } from '../types';

export const AVAILABLE_HOURS = [
  '09:30',
  '10:15',
  '11:00',
  '11:45',
  '12:30',
  '13:15',
  '15:00',
  '15:45',
  '16:30',
  '17:15',
  '18:00',
  '18:45',
  '19:30',
];

const CLIENT_POOL = [
  { name: 'Rodrigo Méndez', phone: '+34 612 890 123', email: 'rodrigo.mendez@empresa.es' },
  { name: 'Ignacio Larrea', phone: '+34 655 432 987', email: 'ilarrea@gmail.com' },
  { name: 'Héctor Valverde', phone: '+34 699 112 334', email: 'hector.valverde@outlook.com' },
  { name: 'Pablo de la Torre', phone: '+34 670 554 123', email: 'pablo.torre@studio.com' },
  { name: 'Guillermo Saavedra', phone: '+34 633 778 990', email: 'gsaavedra@consultora.com' },
  { name: 'Vicente Noguera', phone: '+34 688 221 445', email: 'v.noguera@legal.es' },
  { name: 'Álvaro Montero', phone: '+34 611 998 877', email: 'alvaro.montero@gmail.com' },
  { name: 'Santiago Garrido', phone: '+34 644 332 211', email: 'sgarrido@arquitectos.es' },
  { name: 'Manuel Prieto', phone: '+34 622 110 099', email: 'manuelprieto@gmail.com' },
  { name: 'Daniel Casado', phone: '+34 677 889 001', email: 'danielcasado@yahoo.es' },
  { name: 'Carlos Villareal', phone: '+34 615 447 220', email: 'carlos.villareal@icloud.com' },
  { name: 'Alejandro de la Serna', phone: '+34 601 773 512', email: 'a.delaserna@gmail.com' },
  { name: 'Fernando Beltrán', phone: '+34 654 908 771', email: 'f.beltran@bufete.es' },
  { name: 'Gonzalo Aranguren', phone: '+34 609 336 128', email: 'gonzalo.aranguren@live.com' },
  { name: 'Javier Mendoza', phone: '+34 618 552 903', email: 'jmendoza@techlab.io' },
  { name: 'Ramón Salazar', phone: '+34 662 781 334', email: 'ramon.salazar@outlook.es' },
  { name: 'Tomás Iriarte', phone: '+34 635 220 876', email: 'tomas.iriarte@gmail.com' },
  { name: 'Lucas Ferrer', phone: '+34 691 445 602', email: 'lucas.ferrer@studio.es' },
  { name: 'Emilio Cabrera', phone: '+34 627 318 554', email: 'emilio.cabrera@icloud.com' },
  { name: 'Andrés Villalba', phone: '+34 605 992 147', email: 'andres.villalba@gmail.com' },
  { name: 'Roberto Cañas', phone: '+34 646 107 889', email: 'roberto.canas@empresa.es' },
  { name: 'Nicolás Duarte', phone: '+34 682 660 431', email: 'nicolas.duarte@legal.es' },
  { name: 'Sebastián Rivas', phone: '+34 613 884 276', email: 'sebastian.rivas@gmail.com' },
  { name: 'Eduardo Pardo', phone: '+34 658 219 763', email: 'eduardo.pardo@consultora.com' },
  { name: 'Martín Cordero', phone: '+34 693 771 508', email: 'martin.cordero@live.com' },
  { name: 'Bruno Lamas', phone: '+34 624 663 190', email: 'bruno.lamas@outlook.es' },
  { name: 'Óscar Quintana', phone: '+34 607 528 941', email: 'oscar.quintana@gmail.com' },
  { name: 'Iván Robledo', phone: '+34 659 410 382', email: 'ivan.robledo@icloud.com' },
  { name: 'Adrián Soler', phone: '+34 616 275 830', email: 'adrian.soler@gmail.com' },
  { name: 'Rubén Márquez', phone: '+34 641 903 557', email: 'ruben.marquez@empresa.es' },
];

const CLIENT_NOTES = [
  'Prefiere acabado con pomada mate.',
  'Piel sensible en el cuello, evitar navaja al ras.',
  'Cliente habitual VIP, café espresso doble al llegar.',
  'Degradado mid-fade alto.',
  'Barba simétrica, dejar longitud en el mentón.',
  'Reserva recurrente cada tres semanas.',
  'Solicita toalla caliente extra.',
  'Alergia a productos con alcohol.',
  'Aparca en el parking del edificio.',
  'Le gusta el silencio durante el servicio.',
  'Primera visita, recomendar rutina de cuidado.',
  'Paga con tarjeta y deja propina habitual.',
  'Prefiere cita a última hora de la tarde.',
  'Acabado natural, sin fijación excesiva.',
  'Suele venir acompañado de un compañero de oficina.',
];

export const INITIAL_BUSINESS_CONFIG: BusinessConfig = {
  name: 'AUREUM Barber Club',
  tagline: 'Alta Peluquería & Grooming Masculino de Autor',
  address: 'Paseo de la Castellana 88, Salamanca',
  city: 'Madrid, España',
  phone: '+34 912 345 678',
  whatsapp: '+34 600 123 456',
  email: 'reservas@aureumclub.es',
  scheduleWeekday: 'Lunes a Viernes: 09:30 — 20:30',
  scheduleSaturday: 'Sábados: 10:00 — 19:00',
  scheduleSunday: 'Domingos: Cerrado (Atención VIP privada bajo cita)',
  instagram: '@aureum.barberclub',
  currencySymbol: '€',
  announcement: {
    enabled: true,
    text: 'Cortesía de la casa: Café espresso italiano o single malt whisky con cada reserva premium.',
  },
};

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    name: 'Marcos "El Maestro" Vance',
    nickname: 'El Maestro',
    role: 'Master Barber & Fundador',
    bio: 'Más de 14 años esculpiendo estilo masculino en Milán y Madrid. Especialista en degradados milimétricos y navaja clásica de barbero tradicional.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=700',
    rating: 4.98,
    reviewsCount: 284,
    experienceYears: 14,
    specialties: ['Fade Clásico & Crop Francés', 'Ritual de Toallas Calientes', 'Afeitado Imperial'],
    workingHours: '10:00 - 19:30',
    active: true,
    instagram: '@marcosvance.barber',
  },
  {
    id: 'barber-2',
    name: 'Julián Rossi',
    nickname: 'The Artisan',
    role: 'Senior Stylist & Grooming Specialist',
    bio: 'Formado en la prestigiosa escuela de barbería de Londres. Su enfoque fusiona la pulcritud británica con tendencias contemporáneas de pasarela.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=700',
    rating: 4.95,
    reviewsCount: 196,
    experienceYears: 9,
    specialties: ['Texturizado con Tijera Japonesa', 'Diseño y Esculpido de Barba', 'Peinado Pompadour'],
    workingHours: '10:00 - 18:30',
    active: true,
    instagram: '@julianrossi.grooming',
  },
  {
    id: 'barber-3',
    name: 'Mateo "Blade" Silva',
    nickname: 'Blade',
    role: 'Precision & Fading Artist',
    bio: 'Obsesivo con las líneas limpias, simetría facial y acabados nítidos. Galardonado en torneos internacionales de Skin Fade y Freestyle Grooming.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=700',
    rating: 4.92,
    reviewsCount: 220,
    experienceYears: 7,
    specialties: ['Skin Fade Alta Definición', 'Tinte & Camuflaje de Canas', 'Afeitado Geométrico'],
    workingHours: '11:00 - 20:00',
    active: true,
    instagram: '@mateosilva.cuts',
  },
  {
    id: 'barber-4',
    name: 'Diego Alarcón',
    nickname: 'El Clásico',
    role: 'Gentlemen Barber & Terapista Capilar',
    bio: 'Amante de la tradición señorial de los años 50. Experto en tratamientos revitalizantes de cuero cabelludo y afeitado a navaja de acero damasquino.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=700',
    rating: 4.94,
    reviewsCount: 175,
    experienceYears: 11,
    specialties: ['Tratamiento Capilar Revitalizante', 'Afeitado tradicional a navaja', 'Corte Ejecutivo Clásico'],
    workingHours: '09:30 - 18:00',
    active: true,
    instagram: '@diegoalarcon.barbier',
  },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    category: 'combos_vip',
    name: 'AUREUM Imperial Experience',
    tag: 'El Servicio Insignia',
    durationMinutes: 75,
    price: 65,
    description: 'La experiencia de grooming definitiva. Corte de autor a tijera o máquina, ritual completo de barba con toallas aromáticas al vapor, masaje craneal descontracturante y degustación de whisky japonés.',
    includes: [
      'Diagnóstico de visagismo personalizado',
      'Lavado con champú de carbón activado',
      'Corte de cabello y estilización de autor',
      'Ritual de barba con 3 toallas calientes',
      'Masaje facial con suero de ácido hialurónico',
      'Cortesía: Degustación de licor premium o café espresso',
    ],
    popular: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-2',
    category: 'cortes',
    name: 'Corte Signature & Peinado de Autor',
    tag: 'Más Solicitado',
    durationMinutes: 45,
    price: 32,
    description: 'Corte adaptado a la morfología de tu rostro. Incluye lavado premium pre y post corte con masajes relajantes y acabado profesional con pomadas a base de agua.',
    includes: [
      'Asesoría y análisis morfológico',
      'Corte de precisión a tijera o degradado fade',
      'Lavado doble con tónico refrescante',
      'Peinado y aplicación de cera mate/brillo mate',
    ],
    popular: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-3',
    category: 'barba',
    name: 'Ritual Real de Barba & Toalla Caliente',
    tag: 'Artesanal',
    durationMinutes: 40,
    price: 28,
    description: 'El clásico ritual del caballero. Perfilado de barba a navaja de afeitar tradicional, hidratación profunda con aceites orgánicos de cedro y vapor aromático relajante.',
    includes: [
      'Recorte y simetría de barba',
      'Aceite pre-afeitado suavizante',
      'Aplicación de toallas al vapor con eucalipto',
      'Perfilado a navaja tradicional con gel transparente',
      'Bálsamo regenerador y loción aftershave artesanal',
    ],
    popular: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-4',
    category: 'cortes',
    name: 'Skin Fade Quirúrgico & Texture Crop',
    tag: 'Tendencia',
    durationMinutes: 45,
    price: 34,
    description: 'Degradado a cero o a navaja con transición suave e impecable. Parte superior texturizada para un look moderno, urbano y de fácil mantenimiento.',
    includes: [
      'Fade afeitado con shaver de titanio hipoalergénico',
      'Texturizado con navaja de desfilado',
      'Limpieza de contornos a navaja',
      'Polvos de volumen o pomada fijadora mate',
    ],
    popular: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-5',
    category: 'combos_vip',
    name: 'Dúo Caballero: Corte + Barba Clásica',
    tag: 'Favorito Habituales',
    durationMinutes: 60,
    price: 48,
    description: 'La combinación perfecta para renovar tu imagen completa en una sola sesión de una hora. Estética pulcra y coherente entre cabello y vello facial.',
    includes: [
      'Corte de cabello completo con lavado',
      'Arreglo y perfilado integral de barba',
      'Toalla caliente para abrir poros',
      'Peinado y nutrición capilar y facial',
    ],
    popular: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-6',
    category: 'barba',
    name: 'Afeitado Tradicional Japonés a Navaja',
    tag: 'Experiencia Pura',
    durationMinutes: 35,
    price: 26,
    description: 'Afeitado apurado al ras como antaño. Jabón espumado en taza con brocha de tejón de pelo natural, toalla caliente y tónico astringente de hamamelis.',
    includes: [
      'Espumado caliente en bol de cerámica',
      'Pase a dos manos con navaja japonesa Kamisori',
      'Toalla fría para cerrar poros',
      'Colonia de sándalo y masaje cervical',
    ],
    popular: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-7',
    category: 'tratamientos',
    name: 'Terapia Détox Capilar & Masaje Craneal',
    tag: 'Revitalizante',
    durationMinutes: 30,
    price: 30,
    description: 'Exfoliación suave del cuero cabelludo con sales minerales y mentol para eliminar impurezas, reactivar la microcirculación y prevenir la caída.',
    includes: [
      'Peeling exfoliante purificante',
      '15 minutos de masaje craneo-cervical Shiatsu',
      'Mascarilla de nutrición celular',
      'Oxigenoterapia capilar y peinado',
    ],
    popular: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'serv-8',
    category: 'tratamientos',
    name: 'Camuflaje de Canas Sutil (Color Gray Blending)',
    tag: 'Elegancia Discreta',
    durationMinutes: 35,
    price: 35,
    description: 'Matización natural en 10 minutos sin efecto raíz ni tintes artificiales. Devuelve la juventud a las sienes y barba manteniendo un aspecto maduro distinguido.',
    includes: [
      'Tonalización personalizada tono sobre tono',
      'Aplicación libre de amoniaco',
      'Lavado nutritivo antidesgaste',
      'Secado y estilización',
    ],
    popular: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    clientName: 'Carlos M. Villareal',
    rating: 5,
    date: 'Hace 3 días',
    comment: 'Llevo 2 años viniendo con Marcos Vance. El nivel de detalle en el degradado y la tranquilidad del ritual de toalla caliente no tienen rival en toda la ciudad. Te sirven un café exquisito mientras esperas.',
    serviceName: 'AUREUM Imperial Experience',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'rev-2',
    clientName: 'Alejandro de la Serna',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'Instalaciones dignas de un club privado de primer nivel. El trato de Julián Rossi fue impecable, supo exactamente qué corte me favorecía. La barba quedó simétrica como nunca antes.',
    serviceName: 'Dúo Caballero: Corte + Barba Clásica',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'rev-3',
    clientName: 'Fernando Beltrán',
    rating: 5,
    date: 'Hace 2 semanas',
    comment: 'Ambiente silencioso, elegante, música jazz tenue de fondo y precisión quirúrgica de Mateo. Puntualidad inglesa en la cita reservada desde la web. Volveré cada quince días sin dudarlo.',
    serviceName: 'Skin Fade Quirúrgico & Texture Crop',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'rev-4',
    clientName: 'Gonzalo Aranguren',
    rating: 5,
    date: 'Hace 3 semanas',
    comment: 'El afeitado tradicional con navaja japonesa es una experiencia que todo hombre debería probar al menos una vez al mes. Salí renovado y relajado como si hubiera ido a un spa de lujo.',
    serviceName: 'Afeitado Tradicional Japonés a Navaja',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
  },
];

// Helper to get formatted dates relative to today
const getRelativeDateStr = (dayOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

const BASE_BOOKINGS: Booking[] = [
  {
    id: 'BK-7801',
    clientName: 'Rodrigo Méndez',
    clientPhone: '+34 612 890 123',
    clientEmail: 'rodrigo.mendez@empresa.es',
    serviceId: 'serv-1',
    serviceName: 'AUREUM Imperial Experience',
    servicePrice: 65,
    durationMinutes: 75,
    barberId: 'barber-1',
    barberName: 'Marcos "El Maestro" Vance',
    date: getRelativeDateStr(0),
    time: '10:00',
    status: 'confirmada',
    notes: 'Degustación de whisky escocés solicitada. Primer cliente del día.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'BK-7802',
    clientName: 'Ignacio Larrea',
    clientPhone: '+34 655 432 987',
    clientEmail: 'ilarrea@gmail.com',
    serviceId: 'serv-2',
    serviceName: 'Corte Signature & Peinado de Autor',
    servicePrice: 32,
    durationMinutes: 45,
    barberId: 'barber-2',
    barberName: 'Julián Rossi',
    date: getRelativeDateStr(0),
    time: '11:00',
    status: 'confirmada',
    notes: 'Preferencia por acabado con pomada mate.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'BK-7803',
    clientName: 'Héctor Valverde',
    clientPhone: '+34 699 112 334',
    clientEmail: 'hector.valverde@outlook.com',
    serviceId: 'serv-3',
    serviceName: 'Ritual Real de Barba & Toalla Caliente',
    servicePrice: 28,
    durationMinutes: 40,
    barberId: 'barber-3',
    barberName: 'Mateo "Blade" Silva',
    date: getRelativeDateStr(0),
    time: '12:00',
    status: 'pendiente',
    notes: 'Piel sensible a la navaja en zona cuello.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'BK-7804',
    clientName: 'Pablo de la Torre',
    clientPhone: '+34 670 554 123',
    clientEmail: 'pablo.torre@studio.com',
    serviceId: 'serv-5',
    serviceName: 'Dúo Caballero: Corte + Barba Clásica',
    servicePrice: 48,
    durationMinutes: 60,
    barberId: 'barber-1',
    barberName: 'Marcos "El Maestro" Vance',
    date: getRelativeDateStr(0),
    time: '15:00',
    status: 'confirmada',
    notes: 'Cliente habitual VIP.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'BK-7805',
    clientName: 'Guillermo Saavedra',
    clientPhone: '+34 633 778 990',
    clientEmail: 'gsaavedra@consultora.com',
    serviceId: 'serv-4',
    serviceName: 'Skin Fade Quirúrgico & Texture Crop',
    servicePrice: 34,
    durationMinutes: 45,
    barberId: 'barber-3',
    barberName: 'Mateo "Blade" Silva',
    date: getRelativeDateStr(0),
    time: '16:30',
    status: 'confirmada',
    notes: 'Degradado mid-fade alto.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'BK-7806',
    clientName: 'Vicente Noguera',
    clientPhone: '+34 688 221 445',
    clientEmail: 'v.noguera@legal.es',
    serviceId: 'serv-7',
    serviceName: 'Terapia Détox Capilar & Masaje Craneal',
    servicePrice: 30,
    durationMinutes: 30,
    barberId: 'barber-4',
    barberName: 'Diego Alarcón',
    date: getRelativeDateStr(0),
    time: '17:30',
    status: 'pendiente',
    notes: 'Tratamiento relajante post-jornada.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'BK-7807',
    clientName: 'Álvaro Montero',
    clientPhone: '+34 611 998 877',
    clientEmail: 'alvaro.montero@gmail.com',
    serviceId: 'serv-1',
    serviceName: 'AUREUM Imperial Experience',
    servicePrice: 65,
    durationMinutes: 75,
    barberId: 'barber-2',
    barberName: 'Julián Rossi',
    date: getRelativeDateStr(1),
    time: '11:00',
    status: 'confirmada',
    notes: 'Evento importante el fin de semana.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'BK-7808',
    clientName: 'Santiago Garrido',
    clientPhone: '+34 644 332 211',
    clientEmail: 'sgarrido@arquitectos.es',
    serviceId: 'serv-2',
    serviceName: 'Corte Signature & Peinado de Autor',
    servicePrice: 32,
    durationMinutes: 45,
    barberId: 'barber-1',
    barberName: 'Marcos "El Maestro" Vance',
    date: getRelativeDateStr(1),
    time: '16:00',
    status: 'confirmada',
    notes: '',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'BK-7809',
    clientName: 'Manuel Prieto',
    clientPhone: '+34 622 110 099',
    clientEmail: 'manuelprieto@gmail.com',
    serviceId: 'serv-6',
    serviceName: 'Afeitado Tradicional Japonés a Navaja',
    servicePrice: 26,
    durationMinutes: 35,
    barberId: 'barber-4',
    barberName: 'Diego Alarcón',
    date: getRelativeDateStr(-1),
    time: '12:00',
    status: 'completada',
    notes: 'Atendido satisfactoriamente.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'BK-7810',
    clientName: 'Daniel Casado',
    clientPhone: '+34 677 889 001',
    clientEmail: 'danielcasado@yahoo.es',
    serviceId: 'serv-5',
    serviceName: 'Dúo Caballero: Corte + Barba Clásica',
    servicePrice: 48,
    durationMinutes: 60,
    barberId: 'barber-3',
    barberName: 'Mateo "Blade" Silva',
    date: getRelativeDateStr(-1),
    time: '15:30',
    status: 'completada',
    notes: 'Excelente satisfacción del cliente.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const buildDemoBookings = (base: Booking[]): Booking[] => {
  let seed = 20261108;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const pick = <T,>(list: T[]): T => list[Math.floor(random() * list.length)];

  const usedSlots = new Set(base.map((b) => `${b.barberId}-${b.date}-${b.time}`));
  const bookings: Booking[] = [];
  let counter = 7811;

  const dayPlans = [
    { offset: -7, count: 7 },
    { offset: -6, count: 8 },
    { offset: -5, count: 6 },
    { offset: -4, count: 9 },
    { offset: -3, count: 7 },
    { offset: -2, count: 8 },
    { offset: -1, count: 10 },
    { offset: 0, count: 11 },
    { offset: 1, count: 8 },
    { offset: 2, count: 7 },
    { offset: 3, count: 9 },
    { offset: 4, count: 6 },
    { offset: 5, count: 8 },
    { offset: 6, count: 5 },
    { offset: 7, count: 7 },
  ];

  dayPlans.forEach(({ offset, count }) => {
    const date = getRelativeDateStr(offset);
    let created = 0;
    let attempts = 0;

    while (created < count && attempts < 400) {
      attempts += 1;

      const barber = pick(INITIAL_BARBERS);
      const time = pick(AVAILABLE_HOURS);
      const slotKey = `${barber.id}-${date}-${time}`;
      if (usedSlots.has(slotKey)) continue;
      usedSlots.add(slotKey);

      const client = pick(CLIENT_POOL);
      const service = pick(INITIAL_SERVICES);

      let status: BookingStatus;
      if (offset < 0) {
        status = random() < 0.14 ? 'cancelada' : 'completada';
      } else if (offset === 0) {
        status = random() < 0.5 ? 'completada' : random() < 0.55 ? 'confirmada' : 'pendiente';
      } else {
        status = random() < 0.38 ? 'pendiente' : 'confirmada';
      }

      bookings.push({
        id: `BK-${counter}`,
        clientName: client.name,
        clientPhone: client.phone,
        clientEmail: client.email,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        durationMinutes: service.durationMinutes,
        barberId: barber.id,
        barberName: barber.name,
        date,
        time,
        status,
        notes: random() < 0.3 ? pick(CLIENT_NOTES) : undefined,
        createdAt: new Date(
          Date.now() - (Math.abs(offset) + 1 + Math.floor(random() * 5)) * 86400000
        ).toISOString(),
      });

      counter += 1;
      created += 1;
    }
  });

  return bookings;
};

export const INITIAL_BOOKINGS: Booking[] = [
  ...BASE_BOOKINGS,
  ...buildDemoBookings(BASE_BOOKINGS),
];

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'Alexander Sterling',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-barber-1',
    username: 'marcos',
    name: 'Marcos Vance',
    role: 'barber',
    barberId: 'barber-1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-barber-2',
    username: 'julian',
    name: 'Julián Rossi',
    role: 'barber',
    barberId: 'barber-2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-barber-3',
    username: 'mateo',
    name: 'Mateo Silva',
    role: 'barber',
    barberId: 'barber-3',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-barber-4',
    username: 'diego',
    name: 'Diego Alarcón',
    role: 'barber',
    barberId: 'barber-4',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  },
];

