import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Scissors,
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  Sparkles,
  LogOut,
  Star,
  ExternalLink,
  MessageSquare,
  DollarSign,
  Users,
  UserCheck,
  CalendarClock,
  Search,
  Mail,
  History,
  BadgeCheck,
  Award,
  X,
  LayoutDashboard,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';
import { useToast } from '../components/ui/Toast';
import { Booking, BookingStatus } from '../types';
import { AVAILABLE_HOURS } from '../services/mockData';

interface ClientRecord {
  key: string;
  name: string;
  phone: string;
  email?: string;
  bookings: Booking[];
  sortedBookings: Booking[];
  completed: number;
  noShows: number;
  totalSpent: number;
  notes: string[];
  nextBooking?: Booking;
  lastVisit?: string;
  favoriteService: string;
}

const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

const formatShortDate = (iso?: string) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      })
    : '—';

export default function BarberDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    barbers,
    bookings,
    config,
    authUser,
    updateBookingStatus,
    updateBooking,
    isSlotTaken,
    logout,
  } = useBarberStore();
  const { showToast } = useToast();

  const barberId = id || authUser?.barberId || 'barber-1';
  const currentBarber = useMemo(
    () => barbers.find((b) => b.id === barberId) || barbers[0],
    [barbers, barberId]
  );

  const [activeSection, setActiveSection] = useState<'agenda' | 'clientes'>('agenda');
  const [agendaFilter, setAgendaFilter] = useState<'hoy' | 'proximos' | 'historial'>('hoy');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientKey, setSelectedClientKey] = useState<string | null>(null);

  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleNote, setRescheduleNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const barberBookings = useMemo(() => {
    return bookings.filter((b) => b.barberId === currentBarber?.id);
  }, [bookings, currentBarber]);

  const todayBookings = useMemo(() => {
    return barberBookings
      .filter((b) => b.date === todayStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [barberBookings, todayStr]);

  const upcomingBookings = useMemo(() => {
    return barberBookings
      .filter((b) => b.date > todayStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [barberBookings, todayStr]);

  const historyBookings = useMemo(() => {
    return barberBookings
      .filter((b) => b.date < todayStr || b.status === 'completada' || b.status === 'cancelada')
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  }, [barberBookings, todayStr]);

  const pendingBookings = useMemo(() => {
    return barberBookings
      .filter((b) => b.status === 'pendiente')
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [barberBookings]);

  const clientRecords = useMemo<ClientRecord[]>(() => {
    const map = new Map<string, ClientRecord>();

    barberBookings.forEach((b) => {
      const key = normalizePhone(b.clientPhone) || b.clientName.toLowerCase().trim();
      if (!key) return;

      let record = map.get(key);
      if (!record) {
        record = {
          key,
          name: b.clientName,
          phone: b.clientPhone,
          email: b.clientEmail,
          bookings: [],
          sortedBookings: [],
          completed: 0,
          noShows: 0,
          totalSpent: 0,
          notes: [],
          favoriteService: b.serviceName,
        };
        map.set(key, record);
      }

      record.bookings.push(b);
      if (b.clientEmail && !record.email) record.email = b.clientEmail;
      if (b.status === 'completada') {
        record.completed += 1;
        record.totalSpent += b.servicePrice;
      }
      if (b.status === 'cancelada') record.noShows += 1;
      if (b.notes && !record.notes.includes(b.notes)) record.notes.push(b.notes);
    });

    const records = Array.from(map.values()).map((record) => {
      const sortedBookings = [...record.bookings].sort(
        (a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
      );

      const nextBooking = record.bookings
        .filter(
          (b) =>
            b.date >= todayStr && b.status !== 'cancelada' && b.status !== 'completada'
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];

      const lastVisit = record.bookings
        .filter((b) => b.status === 'completada')
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
        .slice(-1)[0]?.date;

      const serviceCounts = new Map<string, number>();
      record.bookings.forEach((b) => {
        serviceCounts.set(b.serviceName, (serviceCounts.get(b.serviceName) || 0) + 1);
      });
      const favoriteService =
        Array.from(serviceCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        record.favoriteService;

      return {
        ...record,
        sortedBookings,
        nextBooking,
        lastVisit,
        favoriteService,
      };
    });

    return records.sort((a, b) => {
      const dateA = a.nextBooking?.date || a.lastVisit || '';
      const dateB = b.nextBooking?.date || b.lastVisit || '';
      return dateB.localeCompare(dateA) || a.name.localeCompare(b.name);
    });
  }, [barberBookings, todayStr]);

  const barberStats = useMemo(() => {
    const completedToday = todayBookings.filter((b) => b.status === 'completada').length;
    const pendingToday = todayBookings.filter(
      (b) => b.status === 'confirmada' || b.status === 'pendiente'
    ).length;
    const totalEarnings = barberBookings
      .filter((b) => b.status === 'completada')
      .reduce((acc, curr) => acc + curr.servicePrice, 0);
    const regulars = clientRecords.filter((c) => c.completed >= 2).length;

    return {
      totalToday: todayBookings.length,
      completedToday,
      pendingToday,
      totalEarnings,
      totalClients: clientRecords.length,
      regulars,
    };
  }, [todayBookings, barberBookings, clientRecords]);

  const nextClient = useMemo(() => {
    return todayBookings.find((b) => b.status === 'confirmada' || b.status === 'pendiente');
  }, [todayBookings]);

  const filteredClients = useMemo(() => {
    const search = clientSearch.toLowerCase().trim();
    if (!search) return clientRecords;
    return clientRecords.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search) ||
        (c.email || '').toLowerCase().includes(search)
    );
  }, [clientRecords, clientSearch]);

  const selectedClient = useMemo(
    () => clientRecords.find((c) => c.key === selectedClientKey) || null,
    [clientRecords, selectedClientKey]
  );

  const agendaBookings =
    agendaFilter === 'hoy'
      ? todayBookings
      : agendaFilter === 'proximos'
      ? upcomingBookings
      : historyBookings;

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
    showToast(`Cita actualizada a: ${newStatus}`, 'success');
  };

  const handleAccept = (booking: Booking) => {
    updateBookingStatus(booking.id, 'confirmada');
    showToast(`Cita de ${booking.clientName} aceptada y confirmada.`, 'success');
  };

  const handleBarberSwitch = (newBarberId: string) => {
    navigate(`/barbero/${newBarberId}`);
  };

  const openReschedule = (booking: Booking) => {
    setRescheduleBooking(booking);
    setRescheduleDate(booking.date);
    setRescheduleTime(booking.time);
    setRescheduleNote(booking.notes || '');
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking) return;

    if (isSlotTaken(currentBarber.id, rescheduleDate, rescheduleTime, rescheduleBooking.id)) {
      showToast('Ese horario ya está ocupado. Elige otra franja.', 'error');
      return;
    }

    updateBooking({
      ...rescheduleBooking,
      date: rescheduleDate,
      time: rescheduleTime,
      notes: rescheduleNote.trim() || undefined,
      status:
        rescheduleBooking.status === 'cancelada' || rescheduleBooking.status === 'pendiente'
          ? 'confirmada'
          : rescheduleBooking.status,
    });

    showToast(
      `Cita de ${rescheduleBooking.clientName} reagendada al ${rescheduleDate} a las ${rescheduleTime}.`,
      'success'
    );
    setRescheduleBooking(null);
  };

  const statusBadgeClass = (status: BookingStatus) => {
    const map: Record<BookingStatus, string> = {
      confirmada: 'bg-emerald-950 text-emerald-400 border-emerald-500/30',
      pendiente: 'bg-amber-950 text-amber-400 border-amber-500/30',
      completada: 'bg-blue-950 text-blue-400 border-blue-500/30',
      cancelada: 'bg-red-950 text-red-400 border-red-500/30',
    };
    return `text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${map[status]}`;
  };

  const clientTag = (client: ClientRecord) => {
    if (client.completed >= 3) {
      return {
        label: 'VIP',
        className: 'bg-[#C5A059]/15 text-[#E8D4A8] border-[#C5A059]/40',
        icon: Crown,
      };
    }
    if (client.completed >= 1) {
      return {
        label: 'Habitual',
        className: 'bg-emerald-950 text-emerald-400 border-emerald-500/30',
        icon: BadgeCheck,
      };
    }
    if (client.noShows > 0) {
      return {
        label: 'En riesgo',
        className: 'bg-red-950 text-red-400 border-red-500/30',
        icon: XCircle,
      };
    }
    return {
      label: 'Nuevo',
      className: 'bg-white/5 text-gray-300 border-white/10',
      icon: Sparkles,
    };
  };

  if (!currentBarber) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] text-white flex items-center justify-center">
        <p>Barbero no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-[#FAF6EE] pb-24">
      {/* Top Bar */}
      <header className="bg-[#121217] border-b border-[#C5A059]/25 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#1C1C26] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-serif-luxury text-lg font-bold text-white tracking-wider hidden sm:inline">
                AUREUM
              </span>
            </Link>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-md border border-[#C5A059]/30">
              <Users className="w-3.5 h-3.5" />
              <span>Gestión de Clientes</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={currentBarber.id}
                onChange={(e) => handleBarberSwitch(e.target.value)}
                className="bg-[#181824] border border-[#C5A059]/40 rounded-xl px-3 py-1.5 text-xs text-[#E8D4A8] font-semibold focus:outline-none focus:border-[#C5A059] cursor-pointer"
                title="Cambiar perfil de barbero"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    Ver como: {b.name}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hidden md:inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Web</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
                showToast('Sesión cerrada.', 'info');
              }}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-red-950/40"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Barber Profile Header Card */}
        <div className="bg-[#121217] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={currentBarber.photoUrl}
                alt={currentBarber.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#C5A059]/50 shadow-xl shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                    {currentBarber.name}
                  </h1>
                  <span className="text-xs font-mono bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                    "{currentBarber.nickname}"
                  </span>
                </div>
                <p className="text-xs text-[#C5A059] font-semibold mt-1">
                  {currentBarber.role} • {currentBarber.experienceYears} años de oficio
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1 text-[#C5A059]">
                    <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                    <span className="font-bold">{currentBarber.rating}</span>
                    <span className="text-gray-500">({currentBarber.reviewsCount} reseñas)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Jornada: {currentBarber.workingHours}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto text-center">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="flex items-center justify-center gap-1 text-[10px] uppercase text-gray-400 font-semibold">
                  <Users className="w-3 h-3" />
                  Clientes
                </span>
                <span className="font-serif-luxury text-xl font-bold text-white">
                  {barberStats.totalClients}
                </span>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                  Citas Hoy
                </span>
                <span className="font-serif-luxury text-xl font-bold text-white">
                  {barberStats.totalToday}
                </span>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                  Por Aceptar
                </span>
                <span className="font-serif-luxury text-xl font-bold text-amber-300">
                  {pendingBookings.length}
                </span>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                  Ingresos
                </span>
                <span className="font-serif-luxury text-xl font-bold text-emerald-300">
                  {config.currencySymbol}
                  {barberStats.totalEarnings}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection('agenda')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap inline-flex items-center gap-2 ${
              activeSection === 'agenda'
                ? 'bg-[#C5A059] text-[#0A0A0D] shadow-md font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Agenda & Citas</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeSection === 'agenda' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
              }`}
            >
              {barberBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('clientes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap inline-flex items-center gap-2 ${
              activeSection === 'clientes'
                ? 'bg-[#C5A059] text-[#0A0A0D] shadow-md font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Directorio de Clientes</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeSection === 'clientes' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
              }`}
            >
              {clientRecords.length}
            </span>
          </button>
        </div>

        {/* ================= SECTION: AGENDA ================= */}
        {activeSection === 'agenda' && (
          <div className="space-y-8">
            {/* Pending approvals */}
            {pendingBookings.length > 0 && (
              <div className="bg-gradient-to-r from-[#221A10] via-[#1A1610] to-[#121217] rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-amber-300" />
                    <h3 className="font-serif-luxury text-lg font-bold text-white">
                      Solicitudes por aceptar
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                    {pendingBookings.length} pendiente{pendingBookings.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#121217]/80 rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center font-mono shrink-0 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                          <span className="block text-[10px] text-gray-400">
                            {formatShortDate(b.date)}
                          </span>
                          <span className="block text-sm font-bold text-[#E8D4A8]">{b.time}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif-luxury text-base font-bold text-white">
                              {b.clientName}
                            </h4>
                            <span className="text-[10px] text-gray-500 font-mono">{b.id}</span>
                          </div>
                          <p className="text-xs text-gray-300">
                            {b.serviceName} • {b.durationMinutes} min •{' '}
                            {config.currencySymbol}
                            {b.servicePrice}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">{b.clientPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleAccept(b)}
                          className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-colors text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={() => openReschedule(b)}
                          className="px-3 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <CalendarClock className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Reagendar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next client highlight */}
            {nextClient && (
              <div className="bg-gradient-to-r from-[#1E1E2A] via-[#161622] to-[#121217] rounded-3xl p-6 sm:p-7 border border-[#C5A059]/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E8D4A8]">
                      Próximo Cliente en Espera
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm bg-white/10 px-3 py-1 rounded-full">
                    {nextClient.time} hrs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif-luxury text-2xl font-bold text-white">
                        {nextClient.clientName}
                      </h3>
                      <span className="text-xs font-mono text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded">
                        {nextClient.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                      <span className="font-semibold text-white">{nextClient.serviceName}</span>
                      <span>•</span>
                      <span>{nextClient.durationMinutes} minutos</span>
                      <span>•</span>
                      <span className="text-[#C5A059] font-bold">
                        {config.currencySymbol}
                        {nextClient.servicePrice}
                      </span>
                    </div>

                    {nextClient.notes && (
                      <p className="text-xs text-gray-400 italic bg-black/40 p-3 rounded-xl border border-white/5">
                        "{nextClient.notes}"
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-4 flex flex-col gap-2.5">
                    {nextClient.status === 'pendiente' && (
                      <button
                        onClick={() => handleAccept(nextClient)}
                        className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black transition-colors text-xs font-bold inline-flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>ACEPTAR CLIENTE</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleStatusChange(nextClient.id, 'completada')}
                      className="btn-luxury-primary w-full text-center"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>MARCAR CITA COMPLETADA</span>
                    </button>

                    <button
                      onClick={() => openReschedule(nextClient)}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium inline-flex items-center justify-center gap-1.5 border border-white/5"
                    >
                      <CalendarClock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Reagendar a otra hora</span>
                    </button>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${nextClient.clientPhone}`}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 border border-white/5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Llamar</span>
                      </a>

                      <a
                        href={`https://wa.me/${normalizePhone(nextClient.clientPhone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 border border-white/5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agenda filters */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => setAgendaFilter('hoy')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      agendaFilter === 'hoy'
                        ? 'bg-[#C5A059] text-[#0A0A0D] shadow-md'
                        : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Citas de Hoy ({todayBookings.length})
                  </button>

                  <button
                    onClick={() => setAgendaFilter('proximos')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      agendaFilter === 'proximos'
                        ? 'bg-[#C5A059] text-[#0A0A0D] shadow-md'
                        : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Próximos Días ({upcomingBookings.length})
                  </button>

                  <button
                    onClick={() => setAgendaFilter('historial')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      agendaFilter === 'historial'
                        ? 'bg-[#C5A059] text-[#0A0A0D] shadow-md'
                        : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Historial ({historyBookings.length})
                  </button>
                </div>

                <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                  Fecha actual: {todayStr}
                </span>
              </div>

              <div className="space-y-3">
                {agendaBookings.length === 0 ? (
                  <div className="bg-[#121217] rounded-2xl p-10 text-center text-gray-400 border border-white/5">
                    <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-white">Sin citas en esta vista</p>
                    <p className="text-xs mt-1">
                      {agendaFilter === 'hoy'
                        ? 'No tienes más citas agendadas para hoy.'
                        : agendaFilter === 'proximos'
                        ? 'No hay citas futuras registradas para este barbero.'
                        : 'Sin historial previo todavía.'}
                    </p>
                  </div>
                ) : (
                  agendaBookings.map((b) => {
                    const isToday = b.date === todayStr;
                    return (
                      <div
                        key={b.id}
                        className={`bg-[#121217] rounded-2xl p-5 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                          b.status === 'completada'
                            ? 'border-blue-500/20 opacity-80'
                            : b.status === 'cancelada'
                            ? 'border-red-500/20 opacity-60'
                            : 'border-[#C5A059]/30 shadow-lg'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center font-mono shrink-0 bg-white/5 px-3 py-2 rounded-xl border border-white/5 min-w-[74px]">
                            <span className="block text-[10px] text-gray-400">
                              {isToday ? 'HOY' : formatShortDate(b.date)}
                            </span>
                            <span className="block text-sm font-bold text-[#FAF6EE]">{b.time}</span>
                            <span className="block text-[9px] text-gray-500">HRS</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif-luxury text-base font-bold text-white">
                                {b.clientName}
                              </h4>
                              <span className="text-[10px] text-gray-500 font-mono">{b.id}</span>
                            </div>
                            <p className="text-xs text-gray-300 mt-0.5">
                              {b.serviceName} • {b.durationMinutes} min •{' '}
                              {config.currencySymbol}
                              {b.servicePrice}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
                              <span>{b.clientPhone}</span>
                              {b.clientEmail && <span className="text-gray-500">{b.clientEmail}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 lg:self-center">
                          <span className={statusBadgeClass(b.status)}>{b.status}</span>

                          {b.status === 'pendiente' && (
                            <button
                              onClick={() => handleAccept(b)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Aceptar</span>
                            </button>
                          )}

                          {b.status !== 'completada' && b.status !== 'cancelada' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'completada')}
                              className="px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 hover:bg-blue-500 hover:text-black transition-colors text-xs font-semibold"
                            >
                              Completar
                            </button>
                          )}

                          {b.status !== 'completada' && (
                            <button
                              onClick={() => openReschedule(b)}
                              className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-xs font-semibold inline-flex items-center gap-1 border border-white/10"
                            >
                              <CalendarClock className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Reagendar</span>
                            </button>
                          )}

                          {b.status !== 'cancelada' && b.status !== 'completada' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'cancelada')}
                              className="px-2.5 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-xs"
                              title="No asistió"
                            >
                              No asistió
                            </button>
                          )}

                          <a
                            href={`https://wa.me/${normalizePhone(b.clientPhone)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Contactar por WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: CLIENTS ================= */}
        {activeSection === 'clientes' && (
          <div className="space-y-6">
            {/* Client dashboard summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-[#C5A059]/20 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Clientes Totales
                  </span>
                  <Users className="w-4 h-4 text-[#C5A059]" />
                </div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                  {clientRecords.length}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Cartera atendida por ti</p>
              </div>

              <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-lg">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Habituales
                  </span>
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-emerald-300">
                  {barberStats.regulars}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Con 2 o más visitas completadas</p>
              </div>

              <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-amber-500/20 shadow-lg">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Por Aceptar
                  </span>
                  <CalendarClock className="w-4 h-4" />
                </div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-300">
                  {pendingBookings.length}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Solicitudes de cita pendientes</p>
              </div>

              <div className="bg-gradient-to-br from-[#1A1A24] to-[#121217] rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-xl">
                <div className="flex items-center justify-between text-[#E8D4A8] mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Ingresos
                  </span>
                  <DollarSign className="w-4 h-4 text-[#C5A059]" />
                </div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FAF6EE]">
                  {config.currencySymbol}
                  {barberStats.totalEarnings}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Citas completadas</p>
              </div>
            </div>

            {/* Search toolbar */}
            <div className="bg-[#121217] p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Buscar por nombre, teléfono o correo..."
                  className="w-full bg-[#161620] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
              <span className="text-xs text-gray-400">
                Mostrando <span className="text-[#E8D4A8] font-bold">{filteredClients.length}</span>{' '}
                de {clientRecords.length} clientes
              </span>
            </div>

            {/* Client cards */}
            {filteredClients.length === 0 ? (
              <div className="bg-[#121217] rounded-2xl p-12 text-center border border-white/10">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  No se encontraron clientes
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {clientSearch
                    ? 'Prueba con otro nombre, teléfono o correo.'
                    : 'Cuando registres citas, tus clientes aparecerán aquí automáticamente.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredClients.map((client) => {
                  const tag = clientTag(client);
                  const TagIcon = tag.icon;
                  return (
                    <div
                      key={client.key}
                      className="bg-[#121217] rounded-2xl p-5 border border-white/10 hover:border-[#C5A059]/40 transition-all shadow-lg flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E1E2A] to-[#121217] border border-[#C5A059]/30 flex items-center justify-center text-[#E8D4A8] font-serif-luxury text-lg font-bold shrink-0">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-serif-luxury text-base font-bold text-white truncate">
                                {client.name}
                              </h3>
                              <p className="text-xs text-gray-400 font-mono truncate">
                                {client.phone}
                              </p>
                              {client.email && (
                                <p className="text-[11px] text-gray-500 truncate">{client.email}</p>
                              )}
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border shrink-0 ${tag.className}`}
                          >
                            <TagIcon className="w-3 h-3" />
                            <span>{tag.label}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                          <div className="bg-white/5 rounded-xl py-2">
                            <span className="block text-[9px] uppercase text-gray-400 font-semibold">
                              Visitas
                            </span>
                            <span className="text-sm font-bold text-white">
                              {client.bookings.length}
                            </span>
                          </div>
                          <div className="bg-white/5 rounded-xl py-2">
                            <span className="block text-[9px] uppercase text-gray-400 font-semibold">
                              Completadas
                            </span>
                            <span className="text-sm font-bold text-emerald-300">
                              {client.completed}
                            </span>
                          </div>
                          <div className="bg-white/5 rounded-xl py-2">
                            <span className="block text-[9px] uppercase text-gray-400 font-semibold">
                              Gastado
                            </span>
                            <span className="text-sm font-bold text-[#E8D4A8]">
                              {config.currencySymbol}
                              {client.totalSpent}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-[11px] text-gray-400 space-y-1">
                          <p className="truncate">
                            <span className="text-gray-500">Servicio favorito:</span>{' '}
                            <span className="text-gray-200">{client.favoriteService}</span>
                          </p>
                          {client.nextBooking ? (
                            <p className="flex items-center gap-1 text-emerald-300">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Próxima cita: {formatShortDate(client.nextBooking.date)} a las{' '}
                                {client.nextBooking.time}
                              </span>
                            </p>
                          ) : (
                            <p className="flex items-center gap-1">
                              <History className="w-3 h-3 text-gray-500" />
                              <span>
                                Última visita: {formatShortDate(client.lastVisit)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedClientKey(client.key)}
                          className="flex-1 py-2 rounded-xl bg-[#181822] text-[#E8D4A8] border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-[#0A0A0D] transition-all text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                        >
                          <span>Ver ficha completa</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`https://wa.me/${normalizePhone(client.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-white/5 text-emerald-400 hover:bg-emerald-500/20 border border-white/10 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${client.phone}`}
                          className="p-2 rounded-xl bg-white/5 text-[#C5A059] hover:bg-white/10 border border-white/10 transition-colors"
                          title="Llamar"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: CLIENT PROFILE ================= */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C5A059]/40 shadow-2xl">
            <div className="sticky top-0 bg-[#121217] z-10 px-6 sm:px-8 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E1E2A] to-[#121217] border border-[#C5A059]/40 flex items-center justify-center text-[#E8D4A8] font-serif-luxury text-2xl font-bold">
                    {selectedClient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif-luxury text-xl font-bold text-white">
                        {selectedClient.name}
                      </h3>
                      {(() => {
                        const tag = clientTag(selectedClient);
                        const TagIcon = tag.icon;
                        return (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tag.className}`}
                          >
                            <TagIcon className="w-3 h-3" />
                            <span>{tag.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="font-mono">{selectedClient.phone}</span>
                      {selectedClient.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selectedClient.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClientKey(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 space-y-5">
              {/* Client KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                    Visitas
                  </span>
                  <span className="font-serif-luxury text-xl font-bold text-white">
                    {selectedClient.bookings.length}
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                    Completadas
                  </span>
                  <span className="font-serif-luxury text-xl font-bold text-emerald-300">
                    {selectedClient.completed}
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                    No asistió
                  </span>
                  <span className="font-serif-luxury text-xl font-bold text-red-300">
                    {selectedClient.noShows}
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="block text-[10px] uppercase text-gray-400 font-semibold">
                    Total gastado
                  </span>
                  <span className="font-serif-luxury text-xl font-bold text-[#E8D4A8]">
                    {config.currencySymbol}
                    {selectedClient.totalSpent}
                  </span>
                </div>
              </div>

              {/* Next appointment */}
              {selectedClient.nextBooking && (
                <div className="bg-gradient-to-r from-[#1E1E2A] to-[#121217] rounded-2xl p-4 border border-[#C5A059]/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8D4A8]">
                      Próxima cita
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {selectedClient.nextBooking.serviceName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedClient.nextBooking.date} a las{' '}
                        <span className="text-[#E8D4A8] font-bold">
                          {selectedClient.nextBooking.time}
                        </span>{' '}
                        • {config.currencySymbol}
                        {selectedClient.nextBooking.servicePrice}
                      </p>
                      <span
                        className={`inline-block mt-1.5 ${statusBadgeClass(
                          selectedClient.nextBooking.status
                        )}`}
                      >
                        {selectedClient.nextBooking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedClient.nextBooking.status === 'pendiente' && (
                        <button
                          onClick={() => handleAccept(selectedClient.nextBooking as Booking)}
                          className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-colors text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Aceptar</span>
                        </button>
                      )}
                      <button
                        onClick={() => openReschedule(selectedClient.nextBooking as Booking)}
                        className="px-3 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <CalendarClock className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Reagendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedClient.notes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Preferencias y notas</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedClient.notes.map((note, idx) => (
                      <p
                        key={`${selectedClient.key}-note-${idx}`}
                        className="text-xs text-gray-300 italic bg-white/5 p-2.5 rounded-lg border border-white/5"
                      >
                        "{note}"
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <a
                  href={`tel:${selectedClient.phone}`}
                  className="py-2.5 rounded-xl bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 text-xs font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>Llamar</span>
                </a>
                <a
                  href={`https://wa.me/${normalizePhone(selectedClient.phone)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-white/5 text-emerald-300 border border-white/10 hover:bg-emerald-500/10 text-xs font-semibold inline-flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                {selectedClient.email && (
                  <a
                    href={`mailto:${selectedClient.email}`}
                    className="py-2.5 rounded-xl bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 text-xs font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span>Correo</span>
                  </a>
                )}
              </div>

              {/* History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Historial de citas ({selectedClient.sortedBookings.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedClient.sortedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {b.serviceName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {b.date} • {b.time} • {b.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-serif-luxury text-sm font-bold text-[#E8D4A8]">
                          {config.currencySymbol}
                          {b.servicePrice}
                        </span>
                        <span className={statusBadgeClass(b.status)}>{b.status}</span>
                        {b.status !== 'completada' && (
                          <button
                            onClick={() => openReschedule(b)}
                            className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10"
                            title="Reagendar cita"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESCHEDULE ================= */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#C5A059]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Reagendar cita
                </h3>
                <p className="text-xs text-gray-400">
                  {rescheduleBooking.clientName} • {rescheduleBooking.id}
                </p>
              </div>
              <button
                onClick={() => setRescheduleBooking(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-xs text-gray-300 flex items-center justify-between gap-3">
              <span className="truncate">{rescheduleBooking.serviceName}</span>
              <span className="font-mono text-gray-400 shrink-0">
                {rescheduleBooking.durationMinutes} min • {config.currencySymbol}
                {rescheduleBooking.servicePrice}
              </span>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nuevo día</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Nueva hora</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                >
                  {AVAILABLE_HOURS.map((h) => {
                    const taken = isSlotTaken(
                      currentBarber.id,
                      rescheduleDate,
                      h,
                      rescheduleBooking.id
                    );
                    return (
                      <option key={h} value={h} disabled={taken}>
                        {h}
                        {taken ? ' — ocupado' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">
                  Notas para la cita (opcional)
                </label>
                <textarea
                  rows={2}
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <p className="text-[11px] text-gray-500">
                Horario actual: {rescheduleBooking.date} a las {rescheduleBooking.time} con{' '}
                {rescheduleBooking.barberName}.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold inline-flex items-center gap-1.5"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>Guardar nuevo horario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
