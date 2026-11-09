import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Scissors,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  RefreshCw,
  Eye,
  Shield,
  Phone,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';
import { useToast } from '../components/ui/Toast';
import { Booking, BookingStatus, Service, Barber, BusinessConfig } from '../types';
import { AVAILABLE_HOURS } from '../services/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    bookings,
    services,
    barbers,
    config,
    authUser,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    createBooking,
    saveService,
    toggleServiceActive,
    deleteService,
    saveBarber,
    toggleBarberActive,
    saveConfig,
    logout,
    resetAll,
    isSlotTaken,
  } = useBarberStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'reservas' | 'servicios' | 'barberos' | 'config'>('reservas');

  // Filters for bookings
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [barberFilter, setBarberFilter] = useState<string>('todos');
  const [dateFilterMode, setDateFilterMode] = useState<'todas' | 'hoy' | 'manana' | 'personalizado'>('todas');
  const [customDate, setCustomDate] = useState('');

  // Modals
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Business config edit form state
  const [configForm, setConfigForm] = useState<BusinessConfig>(config);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // ================= STATS CALCULATIONS =================
  const stats = useMemo(() => {
    const todayBookings = bookings.filter((b) => b.date === todayStr);
    const pendingCount = bookings.filter((b) => b.status === 'pendiente').length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmada').length;
    const completedCount = bookings.filter((b) => b.status === 'completada').length;

    // Total estimated revenue from confirmed + completed
    const revenue = bookings
      .filter((b) => b.status === 'confirmada' || b.status === 'completada')
      .reduce((acc, curr) => acc + curr.servicePrice, 0);

    return {
      todayCount: todayBookings.length,
      totalCount: bookings.length,
      pendingCount,
      confirmedCount,
      completedCount,
      revenue,
    };
  }, [bookings, todayStr]);

  // ================= FILTERED BOOKINGS =================
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !search ||
        b.clientName.toLowerCase().includes(search) ||
        b.clientPhone.toLowerCase().includes(search) ||
        b.id.toLowerCase().includes(search) ||
        b.serviceName.toLowerCase().includes(search);

      // Status
      const matchStatus = statusFilter === 'todas' || b.status === statusFilter;

      // Barber
      const matchBarber = barberFilter === 'todos' || b.barberId === barberFilter;

      // Date
      let matchDate = true;
      if (dateFilterMode === 'hoy') {
        matchDate = b.date === todayStr;
      } else if (dateFilterMode === 'manana') {
        matchDate = b.date === tomorrowStr;
      } else if (dateFilterMode === 'personalizado' && customDate) {
        matchDate = b.date === customDate;
      }

      return matchSearch && matchStatus && matchBarber && matchDate;
    });
  }, [bookings, searchTerm, statusFilter, barberFilter, dateFilterMode, customDate, todayStr, tomorrowStr]);

  // Handlers
  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    showToast(`Estado de reserva actualizado a ${newStatus}`, 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`¿Estás seguro de eliminar permanentemente la reserva ${id}?`)) {
      deleteBooking(id);
      showToast(`Reserva ${id} eliminada correctamente.`, 'info');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    showToast('Sesión cerrada correctamente.', 'info');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(configForm);
    showToast('Configuración del negocio actualizada con éxito.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-[#FAF6EE] pb-24">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#121217] border-b border-[#C5A059]/25 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#1C1C26] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-serif-luxury text-lg font-bold text-white tracking-wider">
                AUREUM
              </span>
            </Link>
            <span className="text-gray-600">/</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#E8D4A8] text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Panel de Administración</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gerente General: {authUser?.name || 'Alexander Sterling'}</span>
            </div>

            <Link
              to="/"
              className="text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Web</span>
            </Link>

            <button
              onClick={() => {
                if (window.confirm('¿Restaurar todos los datos simulados de la demo?')) {
                  resetAll();
                  showToast('Datos reiniciados con éxito.', 'info');
                }
              }}
              title="Restaurar datos iniciales"
              className="text-xs text-gray-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/40 border border-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
          {/* Card 1: Today */}
          <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-[#C5A059]/20 shadow-lg">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Citas Hoy</span>
              <Calendar className="w-4 h-4 text-[#C5A059]" />
            </div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
              {stats.todayCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Agenda del día en curso</p>
          </div>

          {/* Card 2: Total Bookings */}
          <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-white/5 shadow-lg">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Reservas</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
              {stats.totalCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Histórico en plataforma</p>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-amber-500/20 shadow-lg">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Pendientes</span>
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-300">
              {stats.pendingCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Por verificar con el cliente</p>
          </div>

          {/* Card 4: Confirmed */}
          <div className="bg-[#121217] rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmadas</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-emerald-300">
              {stats.confirmedCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Listas para ser atendidas</p>
          </div>

          {/* Card 5: Estimated Revenue */}
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-[#1A1A24] to-[#121217] rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-xl">
            <div className="flex items-center justify-between text-[#E8D4A8] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Ingresos Est.</span>
              <DollarSign className="w-4 h-4 text-[#C5A059]" />
            </div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FAF6EE]">
              {config.currencySymbol}{stats.revenue}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">De citas confirmadas y completadas</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'reservas', label: 'Gestión de Reservas & Calendario', count: bookings.length },
            { id: 'servicios', label: 'Catálogo de Servicios', count: services.length },
            { id: 'barberos', label: 'Equipo de Barberos', count: barbers.length },
            { id: 'config', label: 'Configuración Visual del Negocio' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#C5A059] text-[#0A0A0D] shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-black/20 text-black'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: RESERVATIONS MANAGEMENT ================= */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            {/* Filter & Action Toolbar */}
            <div className="bg-[#121217] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por cliente, teléfono, código o servicio..."
                    className="w-full bg-[#161620] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                {/* Walk-in Add Button */}
                <button
                  onClick={() => setIsNewBookingModalOpen(true)}
                  className="btn-luxury-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>NUEVA CITA / WALK-IN</span>
                </button>
              </div>

              {/* Filters row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/5 text-xs">
                {/* Date filter */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Filtrar Fecha:
                  </label>
                  <select
                    value={dateFilterMode}
                    onChange={(e) => setDateFilterMode(e.target.value as any)}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="todas">Todas las fechas</option>
                    <option value="hoy">Solo Citas de Hoy</option>
                    <option value="manana">Solo Mañana</option>
                    <option value="personalizado">Fecha Específica...</option>
                  </select>
                </div>

                {dateFilterMode === 'personalizado' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Elegir Día:
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                )}

                {/* Barber filter */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Filtrar Barbero:
                  </label>
                  <select
                    value={barberFilter}
                    onChange={(e) => setBarberFilter(e.target.value)}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="todos">Todos los barberos</option>
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status filter */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Filtrar Estado:
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="todas">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="confirmada">Confirmadas</option>
                    <option value="completada">Completadas</option>
                    <option value="cancelada">Canceladas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Mostrando {filteredBookings.length} reservas registradas</span>
              {(searchTerm || statusFilter !== 'todas' || barberFilter !== 'todos' || dateFilterMode !== 'todas') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('todas');
                    setBarberFilter('todos');
                    setDateFilterMode('todas');
                  }}
                  className="text-[#C5A059] hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Bookings Table / Cards for Mobile */}
            {filteredBookings.length === 0 ? (
              <div className="bg-[#121217] rounded-2xl p-12 text-center border border-white/10">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  No se encontraron reservas
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Intenta cambiar los filtros seleccionados o registra una nueva reserva.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View (>= 1024px) */}
                <div className="hidden lg:block bg-[#121217] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181822] text-gray-400 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Código / Cliente</th>
                        <th className="py-3.5 px-4">Contacto</th>
                        <th className="py-3.5 px-4">Servicio</th>
                        <th className="py-3.5 px-4">Barbero</th>
                        <th className="py-3.5 px-4">Fecha & Hora</th>
                        <th className="py-3.5 px-4">Estado</th>
                        <th className="py-3.5 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#E8D4A8] block">
                              {b.id}
                            </span>
                            <span className="font-semibold text-white text-sm">
                              {b.clientName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-gray-300 block">{b.clientPhone}</span>
                            {b.clientEmail && (
                              <span className="text-[11px] text-gray-500 block truncate max-w-[150px]">
                                {b.clientEmail}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white block truncate max-w-[180px]">
                              {b.serviceName}
                            </span>
                            <span className="text-gray-400 text-[11px]">
                              {config.currencySymbol}{b.servicePrice} • {b.durationMinutes} min
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-gray-200 font-medium">{b.barberName}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-white block font-medium">
                              {b.date}
                            </span>
                            <span className="font-mono font-bold text-[#E8D4A8]">
                              {b.time} hrs
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'confirmada'
                                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                                  : b.status === 'pendiente'
                                  ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                                  : b.status === 'completada'
                                  ? 'bg-blue-950/50 text-blue-300 border border-blue-500/30'
                                  : 'bg-red-950/50 text-red-300 border border-red-500/30'
                              }`}
                            >
                              <span>{b.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'pendiente' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'confirmada')}
                                  title="Confirmar reserva"
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}

                              {b.status === 'confirmada' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'completada')}
                                  title="Marcar como Completada"
                                  className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-black transition-colors"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </button>
                              )}

                              {b.status !== 'cancelada' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'cancelada')}
                                  title="Cancelar reserva"
                                  className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => setEditingBooking(b)}
                                title="Editar detalles de la cita"
                                className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(b.id)}
                                title="Eliminar cita"
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet Responsive Cards View (< 1024px) */}
                <div className="lg:hidden space-y-4">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#121217] rounded-2xl p-5 border border-white/10 shadow-lg space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#E8D4A8]">
                            {b.id}
                          </span>
                          <h3 className="font-serif-luxury text-base font-bold text-white">
                            {b.clientName}
                          </h3>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{b.clientPhone}</p>
                        </div>

                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'confirmada'
                              ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                              : b.status === 'pendiente'
                              ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                              : b.status === 'completada'
                              ? 'bg-blue-950/50 text-blue-300 border border-blue-500/30'
                              : 'bg-red-950/50 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[10px] uppercase text-gray-500 block">Servicio</span>
                          <span className="font-medium text-white">{b.serviceName}</span>
                          <span className="block text-[11px] text-[#C5A059]">
                            {config.currencySymbol}{b.servicePrice}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-500 block">Barbero</span>
                          <span className="font-medium text-white">{b.barberName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-500 block">Fecha</span>
                          <span className="font-mono text-white">{b.date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-500 block">Hora</span>
                          <span className="font-mono font-bold text-[#E8D4A8]">{b.time} hrs</span>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-gray-400 italic bg-white/5 p-2.5 rounded-lg">
                          "{b.notes}"
                        </p>
                      )}

                      {/* Mobile Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                        <div className="flex gap-1.5">
                          {b.status === 'pendiente' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'confirmada')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                            >
                              Confirmar
                            </button>
                          )}
                          {b.status === 'confirmada' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'completada')}
                              className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold"
                            >
                              Completar
                            </button>
                          )}
                          {b.status !== 'cancelada' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'cancelada')}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingBooking(b)}
                            className="p-2 rounded-lg bg-white/5 text-gray-300"
                            title="Editar cita"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400"
                            title="Eliminar cita"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2: SERVICES MANAGEMENT ================= */}
        {activeTab === 'servicios' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Catálogo de Servicios & Precios
                </h3>
                <p className="text-xs text-gray-400">
                  Agrega, edita el valor o activa/desactiva servicios ofrecidos en el club.
                </p>
              </div>

              <button
                onClick={() => setIsNewServiceModalOpen(true)}
                className="btn-luxury-primary"
              >
                <Plus className="w-4 h-4" />
                <span>AÑADIR SERVICIO</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`bg-[#121217] rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    service.active ? 'border-white/10 shadow-lg' : 'border-red-900/30 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                      <button
                        onClick={() => toggleServiceActive(service.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          service.active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {service.active ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>

                    <h4 className="font-serif-luxury text-lg font-bold text-white">
                      {service.name}
                    </h4>

                    <div className="flex items-center gap-3 my-3">
                      <span className="font-serif-luxury text-2xl font-bold text-[#FAF6EE]">
                        {config.currencySymbol}{service.price}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {service.durationMinutes} minutos
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <button
                      onClick={() => setEditingService(service)}
                      className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar Precio / Duración</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar el servicio ${service.name}?`)) {
                          deleteService(service.id);
                          showToast('Servicio eliminado.', 'info');
                        }
                      }}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: BARBERS MANAGEMENT ================= */}
        {activeTab === 'barberos' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-white">
                Gestión del Equipo de Barberos
              </h3>
              <p className="text-xs text-gray-400">
                Supervisa el estado de cada profesional, su horario asignado y accede a su estación individual.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {barbers.map((barber) => {
                const assignedToday = bookings.filter(
                  (b) => b.barberId === barber.id && b.date === todayStr
                ).length;

                return (
                  <div
                    key={barber.id}
                    className="bg-[#121217] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                        <img
                          src={barber.photoUrl}
                          alt={barber.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => toggleBarberActive(barber.id)}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${
                              barber.active
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : 'bg-red-950/80 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {barber.active ? 'Disponible' : 'Descanso'}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-serif-luxury text-base font-bold text-white">
                        {barber.name}
                      </h4>
                      <p className="text-xs text-[#C5A059] font-medium">{barber.role}</p>

                      <div className="space-y-1.5 my-3 text-xs text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jornada:</span>
                          <span className="font-mono">{barber.workingHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Citas hoy:</span>
                          <span className="font-bold text-[#E8D4A8]">{assignedToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Valoración:</span>
                          <span className="text-[#C5A059]">★ {barber.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5">
                      <Link
                        to={`/barbero/${barber.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-[#181822] text-[#E8D4A8] border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-[#0A0A0D] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Vista de este Barbero</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: BUSINESS CONFIGURATION ================= */}
        {activeTab === 'config' && (
          <div className="max-w-3xl bg-[#121217] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#C5A059]" />
                <span>Configuración General del Negocio</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Personaliza los datos visibles en la landing page y en los recibos de reserva.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    value={configForm.name}
                    onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Símbolo de Moneda
                  </label>
                  <input
                    type="text"
                    value={configForm.currencySymbol}
                    onChange={(e) => setConfigForm({ ...configForm, currencySymbol: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Eslogan / Tagline
                </label>
                <input
                  type="text"
                  value={configForm.tagline}
                  onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Dirección Física
                  </label>
                  <input
                    type="text"
                    value={configForm.address}
                    onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Ciudad / País
                  </label>
                  <input
                    type="text"
                    value={configForm.city}
                    onChange={(e) => setConfigForm({ ...configForm, city: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Teléfono Fijo
                  </label>
                  <input
                    type="text"
                    value={configForm.phone}
                    onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    WhatsApp de Atención
                  </label>
                  <input
                    type="text"
                    value={configForm.whatsapp}
                    onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Announcement Bar Settings */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Franja de Anuncio Superior
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={configForm.announcement.enabled}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          announcement: {
                            ...configForm.announcement,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded accent-[#C5A059]"
                    />
                    <span>Mostrar banner</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={configForm.announcement.text}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      announcement: {
                        ...configForm.announcement,
                        text: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#14141B] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn-luxury-primary"
                >
                  <span>GUARDAR CAMBIOS</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ================= MODAL: EDIT BOOKING ================= */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#C5A059]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Editar Reserva {editingBooking.id}
              </h3>
              <button
                onClick={() => setEditingBooking(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBooking(editingBooking);
                setEditingBooking(null);
                showToast(`Reserva ${editingBooking.id} actualizada correctamente`, 'success');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  value={editingBooking.clientName}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, clientName: e.target.value })
                  }
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Teléfono</label>
                <input
                  type="text"
                  value={editingBooking.clientPhone}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, clientPhone: e.target.value })
                  }
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editingBooking.date}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, date: e.target.value })
                    }
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Hora</label>
                  <select
                    value={editingBooking.time}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, time: e.target.value })
                    }
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  >
                    {AVAILABLE_HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Barbero</label>
                  <select
                    value={editingBooking.barberId}
                    onChange={(e) => {
                      const selectedB = barbers.find((b) => b.id === e.target.value);
                      setEditingBooking({
                        ...editingBooking,
                        barberId: e.target.value,
                        barberName: selectedB?.name || '',
                      });
                    }}
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Estado</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        status: e.target.value as BookingStatus,
                      })
                    }
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Notas especiales</label>
                <textarea
                  rows={2}
                  value={editingBooking.notes || ''}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, notes: e.target.value })
                  }
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANUAL WALK-IN BOOKING ================= */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#C5A059]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Nueva Cita Manual / Cliente Presencial
              </h3>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const cName = form.clientName.value;
                const cPhone = form.clientPhone.value;
                const sId = form.serviceId.value;
                const bId = form.barberId.value;
                const date = form.date.value;
                const time = form.time.value;

                const serv = services.find((s) => s.id === sId);
                const barb = barbers.find((b) => b.id === bId);

                if (!serv || !barb) return;

                if (isSlotTaken(bId, date, time)) {
                  showToast('Este horario ya está ocupado con este barbero.', 'error');
                  return;
                }

                createBooking({
                  clientName: cName,
                  clientPhone: cPhone,
                  serviceId: serv.id,
                  serviceName: serv.name,
                  servicePrice: serv.price,
                  durationMinutes: serv.durationMinutes,
                  barberId: barb.id,
                  barberName: barb.name,
                  date,
                  time,
                  status: 'confirmada',
                  notes: 'Agendada presencialmente por Gerencia',
                });

                setIsNewBookingModalOpen(false);
                showToast('Cita manual registrada y confirmada.', 'success');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre del Cliente *</label>
                <input
                  name="clientName"
                  type="text"
                  required
                  placeholder="Ej. Javier Mendoza"
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Teléfono Móvil *</label>
                <input
                  name="clientPhone"
                  type="tel"
                  required
                  placeholder="Ej. +34 600 000 000"
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Servicio *</label>
                <select
                  name="serviceId"
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {services.filter((s) => s.active).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({config.currencySymbol}{s.price} - {s.durationMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Barbero *</label>
                <select
                  name="barberId"
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {barbers.filter((b) => b.active).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Fecha *</label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={todayStr}
                    required
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Hora *</label>
                  <select
                    name="time"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    {AVAILABLE_HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold"
                >
                  Registrar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT SERVICE ================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#C5A059]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Editar Servicio
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveService(editingService);
                setEditingService(null);
                showToast('Servicio actualizado con éxito.', 'success');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Precio ({config.currencySymbol})</label>
                  <input
                    type="number"
                    min={1}
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={editingService.durationMinutes}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        durationMinutes: parseInt(e.target.value) || 30,
                      })
                    }
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW SERVICE ================= */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#C5A059]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Crear Nuevo Servicio
              </h3>
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newServ: Service = {
                  id: `serv-${Date.now()}`,
                  name: form.name.value,
                  category: form.category.value,
                  price: parseFloat(form.price.value) || 30,
                  durationMinutes: parseInt(form.duration.value) || 45,
                  description: form.description.value,
                  includes: [
                    'Atención individualizada',
                    'Lavado y acondicionamiento',
                    'Bebida de cortesía',
                  ],
                  popular: false,
                  active: true,
                };
                saveService(newServ);
                setIsNewServiceModalOpen(false);
                showToast(`Servicio "${newServ.name}" creado con éxito.`, 'success');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre del Servicio *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Ej. Ritual de Barba Escandinava"
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Categoría *</label>
                <select
                  name="category"
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  <option value="cortes">Cortes de Autor</option>
                  <option value="barba">Rituales de Barba</option>
                  <option value="combos_vip">Combos VIP</option>
                  <option value="tratamientos">Tratamientos Capilares</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Precio ({config.currencySymbol}) *</label>
                  <input
                    name="price"
                    type="number"
                    min={1}
                    defaultValue={35}
                    required
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Duración (min) *</label>
                  <input
                    name="duration"
                    type="number"
                    min={10}
                    defaultValue={45}
                    required
                    className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Descripción *</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  placeholder="Detalles sobre las técnicas aplicadas y sensaciones del cliente..."
                  className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold"
                >
                  Crear Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

