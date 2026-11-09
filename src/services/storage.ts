import { Booking, Service, Barber, BusinessConfig, AuthUser, BookingStatus } from '../types';
import {
  INITIAL_BOOKINGS,
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_BUSINESS_CONFIG,
  DEMO_USERS,
} from './mockData';

const KEYS = {
  BOOKINGS: 'aureum_bookings_v2',
  SERVICES: 'aureum_services_v1',
  BARBERS: 'aureum_barbers_v1',
  CONFIG: 'aureum_config_v1',
  AUTH: 'aureum_auth_user_v1',
};

const notifyChange = (key: string) => {
  window.dispatchEvent(new CustomEvent('aureum_storage_update', { detail: { key } }));
};

export const StorageService = {
  // --- Bookings ---
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const bookings = this.getBookings();
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newBooking, ...bookings];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    notifyChange(KEYS.BOOKINGS);
    return newBooking;
  },

  updateBookingStatus(id: string, status: BookingStatus): boolean {
    const bookings = this.getBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    notifyChange(KEYS.BOOKINGS);
    return true;
  },

  updateBooking(updatedBooking: Booking): boolean {
    const bookings = this.getBookings();
    const updated = bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    notifyChange(KEYS.BOOKINGS);
    return true;
  },

  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const updated = bookings.filter((b) => b.id !== id);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    notifyChange(KEYS.BOOKINGS);
    return true;
  },

  // Check if a barber already has a booking at that date and time (excluding cancelled)
  isSlotTaken(barberId: string, date: string, time: string, excludeBookingId?: string): boolean {
    const bookings = this.getBookings();
    return bookings.some(
      (b) =>
        b.barberId === barberId &&
        b.date === date &&
        b.time === time &&
        b.status !== 'cancelada' &&
        (!excludeBookingId || b.id !== excludeBookingId)
    );
  },

  // --- Services ---
  getServices(): Service[] {
    try {
      const data = localStorage.getItem(KEYS.SERVICES);
      if (!data) {
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
        return INITIAL_SERVICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SERVICES;
    }
  },

  saveService(service: Service): void {
    const services = this.getServices();
    const exists = services.some((s) => s.id === service.id);
    let updated: Service[];
    if (exists) {
      updated = services.map((s) => (s.id === service.id ? service : s));
    } else {
      updated = [...services, service];
    }
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(updated));
    notifyChange(KEYS.SERVICES);
  },

  toggleServiceActive(id: string): void {
    const services = this.getServices();
    const updated = services.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(updated));
    notifyChange(KEYS.SERVICES);
  },

  deleteService(id: string): void {
    const services = this.getServices();
    const updated = services.filter((s) => s.id !== id);
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(updated));
    notifyChange(KEYS.SERVICES);
  },

  // --- Barbers ---
  getBarbers(): Barber[] {
    try {
      const data = localStorage.getItem(KEYS.BARBERS);
      if (!data) {
        localStorage.setItem(KEYS.BARBERS, JSON.stringify(INITIAL_BARBERS));
        return INITIAL_BARBERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BARBERS;
    }
  },

  saveBarber(barber: Barber): void {
    const barbers = this.getBarbers();
    const exists = barbers.some((b) => b.id === barber.id);
    let updated: Barber[];
    if (exists) {
      updated = barbers.map((b) => (b.id === barber.id ? barber : b));
    } else {
      updated = [...barbers, barber];
    }
    localStorage.setItem(KEYS.BARBERS, JSON.stringify(updated));
    notifyChange(KEYS.BARBERS);
  },

  toggleBarberActive(id: string): void {
    const barbers = this.getBarbers();
    const updated = barbers.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    localStorage.setItem(KEYS.BARBERS, JSON.stringify(updated));
    notifyChange(KEYS.BARBERS);
  },

  // --- Business Config ---
  getConfig(): BusinessConfig {
    try {
      const data = localStorage.getItem(KEYS.CONFIG);
      if (!data) {
        localStorage.setItem(KEYS.CONFIG, JSON.stringify(INITIAL_BUSINESS_CONFIG));
        return INITIAL_BUSINESS_CONFIG;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BUSINESS_CONFIG;
    }
  },

  saveConfig(config: BusinessConfig): void {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    notifyChange(KEYS.CONFIG);
  },

  // --- Auth Session ---
  getAuth(): AuthUser | null {
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  loginAs(userId: string): AuthUser | null {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
      notifyChange(KEYS.AUTH);
      return user;
    }
    return null;
  },

  loginWithUsername(username: string): AuthUser | null {
    const normalized = username.toLowerCase().trim();
    const user = DEMO_USERS.find((u) => u.username.toLowerCase() === normalized);
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
      notifyChange(KEYS.AUTH);
      return user;
    }
    return null;
  },

  logout(): void {
    localStorage.removeItem(KEYS.AUTH);
    notifyChange(KEYS.AUTH);
  },

  // --- Restore Clean Demo Data ---
  resetAll(): void {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(KEYS.BARBERS, JSON.stringify(INITIAL_BARBERS));
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(INITIAL_BUSINESS_CONFIG));
    notifyChange('all');
  },
};

