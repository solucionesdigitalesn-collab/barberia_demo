export type ServiceCategory = 'cortes' | 'barba' | 'tratamientos' | 'combos_vip';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  tag?: string;
  durationMinutes: number;
  price: number;
  description: string;
  includes: string[];
  popular?: boolean;
  active: boolean;
  image?: string;
}

export interface Barber {
  id: string;
  name: string;
  nickname: string;
  role: string;
  bio: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  specialties: string[];
  workingHours: string;
  active: boolean;
  instagram?: string;
}

export type BookingStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  durationMinutes: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  comment: string;
  serviceName: string;
  avatar: string;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  scheduleWeekday: string;
  scheduleSaturday: string;
  scheduleSunday: string;
  instagram: string;
  currencySymbol: string;
  announcement: {
    enabled: boolean;
    text: string;
  };
}

export type UserRole = 'admin' | 'barber';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  barberId?: string;
  avatar: string;
}

