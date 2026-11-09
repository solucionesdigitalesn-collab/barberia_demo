import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { Booking, Service, Barber, BusinessConfig, AuthUser } from '../types';

export function useBarberStore() {
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [services, setServices] = useState<Service[]>(() => StorageService.getServices());
  const [barbers, setBarbers] = useState<Barber[]>(() => StorageService.getBarbers());
  const [config, setConfig] = useState<BusinessConfig>(() => StorageService.getConfig());
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => StorageService.getAuth());

  const refreshAll = useCallback(() => {
    setBookings(StorageService.getBookings());
    setServices(StorageService.getServices());
    setBarbers(StorageService.getBarbers());
    setConfig(StorageService.getConfig());
    setAuthUser(StorageService.getAuth());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      refreshAll();
    };

    window.addEventListener('aureum_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aureum_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshAll]);

  return {
    bookings,
    services,
    barbers,
    config,
    authUser,
    refreshAll,
    createBooking: (data: Omit<Booking, 'id' | 'createdAt'>) => StorageService.createBooking(data),
    updateBookingStatus: (id: string, status: any) => StorageService.updateBookingStatus(id, status),
    updateBooking: (booking: Booking) => StorageService.updateBooking(booking),
    deleteBooking: (id: string) => StorageService.deleteBooking(id),
    isSlotTaken: (barberId: string, date: string, time: string, excludeId?: string) =>
      StorageService.isSlotTaken(barberId, date, time, excludeId),
    saveService: (service: Service) => StorageService.saveService(service),
    toggleServiceActive: (id: string) => StorageService.toggleServiceActive(id),
    deleteService: (id: string) => StorageService.deleteService(id),
    saveBarber: (barber: Barber) => StorageService.saveBarber(barber),
    toggleBarberActive: (id: string) => StorageService.toggleBarberActive(id),
    saveConfig: (newConfig: BusinessConfig) => StorageService.saveConfig(newConfig),
    loginAs: (userId: string) => StorageService.loginAs(userId),
    loginWithUsername: (username: string) => StorageService.loginWithUsername(username),
    logout: () => StorageService.logout(),
    resetAll: () => StorageService.resetAll(),
  };
}

