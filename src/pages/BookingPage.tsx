import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Scissors,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Download,
  AlertCircle,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';
import { useToast } from '../components/ui/Toast';
import { AVAILABLE_HOURS } from '../services/mockData';
import { Service, Barber, Booking } from '../types';

import { playLuxuryChime } from '../utils/audio';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { services, barbers, config, createBooking, isSlotTaken } = useBarberStore();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    searchParams.get('serviceId') || ''
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    searchParams.get('barberId') || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Confirmation result
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Auto-advance if params were pre-filled
  useEffect(() => {
    const sId = searchParams.get('serviceId');
    const bId = searchParams.get('barberId');
    if (sId && !bId) {
      setSelectedServiceId(sId);
      setCurrentStep(2);
    } else if (bId && !sId) {
      setSelectedBarberId(bId);
      setCurrentStep(1);
    } else if (sId && bId) {
      setSelectedServiceId(sId);
      setSelectedBarberId(bId);
      setCurrentStep(3);
    }
  }, [searchParams]);

  // Selected entities
  const activeServices = useMemo(() => services.filter((s) => s.active), [services]);
  const activeBarbers = useMemo(() => barbers.filter((b) => b.active), [barbers]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const selectedBarber = useMemo(
    () => barbers.find((b) => b.id === selectedBarberId),
    [barbers, selectedBarberId]
  );

  // Generate 14 selectable upcoming days
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('es-ES', { month: 'short' });
      const isSunday = d.getDay() === 0;
      dates.push({
        iso,
        dayName: dayName.toUpperCase(),
        dayNum,
        monthName: monthName.toUpperCase(),
        isSunday,
        label: i === 0 ? 'HOY' : i === 1 ? 'MAÑANA' : dayName.toUpperCase(),
      });
    }
    return dates;
  }, []);

  // Initialize selected date to today if empty
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].iso);
    }
  }, [selectedDate, availableDates]);

  // Determine available hours for the chosen date and barber
  const slotAvailability = useMemo(() => {
    if (!selectedDate) return [];

    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return AVAILABLE_HOURS.map((hourStr) => {
      const [h, m] = hourStr.split(':').map(Number);
      const isPast = isToday && (h < currentHour || (h === currentHour && m <= currentMinute));

      let isOccupied = false;
      if (selectedBarberId) {
        // Specific barber
        isOccupied = isSlotTaken(selectedBarberId, selectedDate, hourStr);
      } else {
        // "Cualquier barbero": check if ALL active barbers are booked at this hour
        const allBooked = activeBarbers.every((b) => isSlotTaken(b.id, selectedDate, hourStr));
        isOccupied = allBooked;
      }

      return {
        time: hourStr,
        available: !isPast && !isOccupied,
        isPast,
        isOccupied,
      };
    });
  }, [selectedDate, selectedBarberId, activeBarbers, isSlotTaken]);

  // Submission handler
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      showToast('Por favor selecciona un servicio.', 'error');
      setCurrentStep(1);
      return;
    }

    // If no specific barber, assign first available barber for this slot
    let finalBarberId = selectedBarberId;
    let finalBarberName = selectedBarber?.name || '';

    if (!finalBarberId) {
      const candidate = activeBarbers.find(
        (b) => !isSlotTaken(b.id, selectedDate, selectedTime)
      );
      if (candidate) {
        finalBarberId = candidate.id;
        finalBarberName = candidate.name;
      } else {
        showToast('No hay barberos disponibles en este horario.', 'error');
        return;
      }
    }

    // Double check slot availability
    if (isSlotTaken(finalBarberId, selectedDate, selectedTime)) {
      showToast('Este horario ya ha sido reservado. Por favor elige otra hora.', 'error');
      return;
    }

    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Por favor introduce tu nombre y número de teléfono.', 'error');
      return;
    }

    const newBooking = createBooking({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      durationMinutes: selectedService.durationMinutes,
      barberId: finalBarberId,
      barberName: finalBarberName,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmada',
      notes: clientNotes.trim() || undefined,
    });

    setConfirmedBooking(newBooking);
    setCurrentStep(5);
    playLuxuryChime('success');
    showToast('¡Reserva completada con éxito! Te esperamos.', 'success');
  };

  const downloadIcsFile = () => {
    if (!confirmedBooking) return;
    try {
      const [year, month, day] = confirmedBooking.date.split('-');
      const [hours, minutes] = confirmedBooking.time.split(':');
      const start = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
      const end = new Date(start.getTime() + confirmedBooking.durationMinutes * 60000);

      const formatIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AUREUM Barber Club//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${confirmedBooking.id}@aureumclub.es`,
        `DTSTAMP:${formatIcs(new Date())}`,
        `DTSTART:${formatIcs(start)}`,
        `DTEND:${formatIcs(end)}`,
        `SUMMARY:Cita AUREUM: ${confirmedBooking.serviceName}`,
        `DESCRIPTION:Cita confirmada con ${confirmedBooking.barberName} en AUREUM Barber Club. Localizador: ${confirmedBooking.id}`,
        `LOCATION:${config.address}, ${config.city}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Cita-AUREUM-${confirmedBooking.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Archivo de cita (.ics) descargado con éxito.', 'success');
    } catch {
      showToast('No se pudo generar el archivo de calendario.', 'error');
    }
  };

  const copyBookingReference = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(
        `Cita AUREUM Barber Club: ${confirmedBooking.id} | ${confirmedBooking.date} a las ${confirmedBooking.time} con ${confirmedBooking.barberName}`
      );
      showToast('Detalles de reserva copiados al portapapeles.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-[#FAF6EE] pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#C5A059] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver a la Página Principal</span>
          </Link>
        </div>

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181822] border border-[#C5A059]/30 text-xs uppercase tracking-widest text-[#C5A059] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema de Reservas Exclusivo</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF6EE]">
            Reserva tu Experiencia
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-light">
            Selecciona tu servicio de autor, maestro barbero y franja horaria preferida.
          </p>
        </div>

        {/* Step Indicator */}
        {currentStep < 5 && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 grid grid-cols-4 gap-1.5 text-center">
              {[
                { num: 1, label: 'Servicio' },
                { num: 2, label: 'Barbero' },
                { num: 3, label: 'Fecha' },
                { num: 4, label: 'Tus Datos' },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isPassed = currentStep > step.num;
                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      if (step.num < currentStep) setCurrentStep(step.num);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#C5A059] text-[#09090C] font-bold shadow-md shadow-[#C5A059]/25'
                        : isPassed
                        ? 'bg-white/10 text-white'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{step.num}. {step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 1: SERVICE SELECTION ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-serif-luxury text-xl font-bold text-[#FAF6EE] flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#C5A059]" />
                <span>1. Elige tu Servicio o Ritual</span>
              </h2>
              <span className="text-xs text-gray-400">Paso 1 de 4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1A1A26] border-[#C5A059] shadow-xl shadow-[#C5A059]/15 ring-1 ring-[#C5A059]'
                        : 'bg-[#121217] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          {service.tag && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded mb-1">
                              {service.tag}
                            </span>
                          )}
                          <h3 className="font-serif-luxury text-lg font-bold text-white">
                            {service.name}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif-luxury text-xl font-bold text-[#FAF6EE]">
                            {config.currencySymbol}{service.price}
                          </span>
                          <p className="text-[11px] text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#C5A059]" />
                            <span>{service.durationMinutes} min</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[11px] text-gray-400">
                        {service.includes.length} detalles incluidos
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#C5A059] border-[#C5A059] text-black font-bold'
                            : 'border-white/20'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-6 border-t border-white/[0.06]">
              <button
                disabled={!selectedServiceId}
                onClick={() => setCurrentStep(2)}
                className="btn-luxury-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>CONTINUAR A SELECCIÓN DE BARBERO</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: BARBER SELECTION ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-serif-luxury text-xl font-bold text-[#FAF6EE] flex items-center gap-2">
                <User className="w-5 h-5 text-[#C5A059]" />
                <span>2. Selecciona a tu Maestro Barbero</span>
              </h2>
              <span className="text-xs text-gray-400">Paso 2 de 4</span>
            </div>

            {/* Any barber option */}
            <div
              onClick={() => setSelectedBarberId('')}
              className={`p-5 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                selectedBarberId === ''
                  ? 'bg-[#1A1A26] border-[#C5A059] shadow-lg shadow-[#C5A059]/15 ring-1 ring-[#C5A059]'
                  : 'bg-[#121217] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E1E26] to-[#121217] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-white">
                    Cualquier Maestro Disponible (Recomendado)
                  </h3>
                  <p className="text-xs text-gray-400 font-light">
                    Te asignaremos al profesional libre con máxima disponibilidad para tu horario preferido.
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedBarberId === ''
                    ? 'bg-[#C5A059] border-[#C5A059] text-black font-bold'
                    : 'border-white/20'
                }`}
              >
                {selectedBarberId === '' && '✓'}
              </div>
            </div>

            {/* Specific Barbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeBarbers.map((barber) => {
                const isSelected = selectedBarberId === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all flex gap-4 ${
                      isSelected
                        ? 'bg-[#1A1A26] border-[#C5A059] shadow-xl shadow-[#C5A059]/15 ring-1 ring-[#C5A059]'
                        : 'bg-[#121217] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={barber.photoUrl}
                      alt={barber.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-luxury text-base font-bold text-white truncate">
                          {barber.name}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#C5A059] border-[#C5A059] text-black font-bold'
                              : 'border-white/20'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#C5A059] font-medium mt-0.5">{barber.role}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1 text-[#C5A059]">
                          ★ {barber.rating}
                        </span>
                        <span>•</span>
                        <span>{barber.experienceYears} años exp.</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 truncate">
                        {barber.specialties.join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-luxury-secondary"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a Servicios</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="btn-luxury-primary"
              >
                <span>Continuar a Fecha & Hora</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DATE & TIME SELECTION ================= */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-serif-luxury text-xl font-bold text-[#FAF6EE] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#C5A059]" />
                <span>3. Fecha y Franja Horaria</span>
              </h2>
              <span className="text-xs text-gray-400">Paso 3 de 4</span>
            </div>

            {/* 1. Date Selector (Carousel/Grid of 14 Days) */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3">
                Selecciona el día:
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      disabled={item.isSunday}
                      onClick={() => {
                        setSelectedDate(item.iso);
                        setSelectedTime(''); // Reset time when changing date
                      }}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        item.isSunday
                          ? 'opacity-30 border-white/5 bg-[#0E0E12] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#C5A059] border-[#C5A059] text-[#0A0A0D] shadow-lg shadow-[#C5A059]/20 font-bold scale-[1.03]'
                          : 'bg-[#121217] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <span className="block text-[10px] tracking-wider opacity-80">
                        {item.label}
                      </span>
                      <span className="block font-serif-luxury text-xl font-bold my-0.5">
                        {item.dayNum}
                      </span>
                      <span className="block text-[10px] tracking-wider opacity-80">
                        {item.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Time Slots Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Horarios Disponibles para {selectedDate}:</span>
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A24] border border-white/20" />
                    Disponible
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-950/40 border border-red-500/40" />
                    Reservado
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {slotAvailability.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-3 px-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all ${
                        isSelected
                          ? 'bg-[#C5A059] border-[#C5A059] text-[#0A0A0D] shadow-md shadow-[#C5A059]/30 scale-[1.02]'
                          : !slot.available
                          ? 'bg-[#150F11] border-red-900/30 text-gray-600 cursor-not-allowed line-through'
                          : 'bg-[#14141B] border-white/10 text-gray-200 hover:border-[#C5A059] hover:text-[#C5A059]'
                      }`}
                    >
                      {slot.time}
                      {!slot.available && (
                        <span className="block text-[9px] font-sans no-underline text-red-400/80 mt-0.5">
                          {slot.isPast ? 'Pasada' : 'Ocupada'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-luxury-secondary"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a Barbero</span>
              </button>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setCurrentStep(4)}
                className="btn-luxury-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>CONTINUAR A TUS DATOS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CLIENT DETAILS & SUMMARY ================= */}
        {currentStep === 4 && (
          <form onSubmit={handleConfirmReservation} className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-serif-luxury text-xl font-bold text-[#FAF6EE] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span>4. Información de Contacto & Confirmación</span>
              </h2>
              <span className="text-xs text-gray-400">Paso 4 de 4</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Rodrigo Álvarez"
                      className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Teléfono Móvil (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ej. +34 612 345 678"
                      className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Te enviaremos un recordatorio por WhatsApp 2 horas antes de tu cita.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Correo Electrónico (Opcional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Ej. rodrigo@alvarez.es"
                      className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Notas Especiales / Preferencias de Bebida
                  </label>
                  <textarea
                    rows={3}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Ej. Prefiero degradado mid-fade alto, piel sensible en el cuello, o café espresso doble al llegar..."
                    className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Appointment Summary Card */}
              <div className="lg:col-span-5 bg-[#121217] rounded-2xl p-6 border border-[#C5A059]/30 shadow-xl space-y-4">
                <h3 className="font-serif-luxury text-base font-bold text-[#FAF6EE] pb-3 border-b border-white/10">
                  Resumen de tu Cita
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Servicio</span>
                    <span className="font-semibold text-white text-right max-w-[60%]">
                      {selectedService?.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-white/5">
                    <span className="text-gray-400">Duración</span>
                    <span className="font-mono text-white">{selectedService?.durationMinutes} min</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-white/5">
                    <span className="text-gray-400">Barbero Asignado</span>
                    <span className="font-semibold text-[#C5A059]">
                      {selectedBarber ? selectedBarber.name : 'Primer Barbero Libre'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-white/5">
                    <span className="text-gray-400">Fecha</span>
                    <span className="font-mono text-white">{selectedDate}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-white/5">
                    <span className="text-gray-400">Hora</span>
                    <span className="font-mono font-bold text-white text-sm bg-white/5 px-2 py-0.5 rounded">
                      {selectedTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#C5A059]/30 text-sm">
                    <span className="font-bold text-white font-serif-luxury">Importe a Abonar</span>
                    <span className="font-serif-luxury text-2xl font-bold text-[#FAF6EE]">
                      {config.currencySymbol}{selectedService?.price}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 italic text-right">
                    Se abona presencialmente tras disfrutar de la experiencia.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="btn-editorial-gold w-full text-center"
                  >
                    <span>CONFIRMAR RESERVA INMEDIATA</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-start pt-6 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-editorial-outline"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>VOLVER A FECHA & HORA</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 5: VIP CONFIRMATION TICKET ================= */}
        {currentStep === 5 && confirmedBooking && (
          <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            {/* Success Banner */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                ¡Reserva Confirmada con Éxito!
              </h2>
              <p className="text-xs text-gray-400 font-light">
                Tu cita ha quedado registrada en el sistema de AUREUM Barber Club.
              </p>
            </div>

            {/* Luxury Digital Ticket */}
            <div className="bg-gradient-to-b from-[#181822] via-[#121217] to-[#0E0E14] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl" />

              {/* Ticket Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-sm font-bold text-white leading-none">
                      AUREUM
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A059]">
                      VIP Appointment Pass
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
                    Código Localizador
                  </span>
                  <span className="font-mono text-base font-bold text-[#E8D4A8]">
                    {confirmedBooking.id}
                  </span>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 block font-semibold">
                      Cliente
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {confirmedBooking.clientName}
                    </span>
                    <span className="text-xs text-gray-400 block font-mono">
                      {confirmedBooking.clientPhone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-gray-500 block font-semibold">
                      Maestro Barbero
                    </span>
                    <span className="font-semibold text-[#C5A059] text-sm">
                      {confirmedBooking.barberName}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 block font-semibold">
                      Fecha de la Cita
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {confirmedBooking.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-gray-500 block font-semibold">
                      Hora
                    </span>
                    <span className="font-mono font-bold text-[#E8D4A8] text-base">
                      {confirmedBooking.time} hrs
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <span className="text-[10px] uppercase text-gray-500 block font-semibold">
                    Servicio Reservado
                  </span>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-xs font-semibold text-white">
                      {confirmedBooking.serviceName} ({confirmedBooking.durationMinutes} min)
                    </span>
                    <span className="font-serif-luxury text-lg font-bold text-[#FAF6EE]">
                      {config.currencySymbol}{confirmedBooking.servicePrice}
                    </span>
                  </div>
                </div>

                {confirmedBooking.notes && (
                  <div className="pt-3 border-t border-white/5">
                    <span className="text-[10px] uppercase text-gray-500 block font-semibold">
                      Notas especiales
                    </span>
                    <p className="text-xs text-gray-400 italic">"{confirmedBooking.notes}"</p>
                  </div>
                )}
              </div>

              {/* QR Mockup & Location */}
              <div className="pt-6 border-t border-dashed border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <QrCode className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Pase Digital Válido</p>
                    <p className="text-[10px] text-gray-400">{config.address}</p>
                    <p className="text-[10px] text-gray-500">{config.phone}</p>
                  </div>
                </div>

                <button
                  onClick={copyBookingReference}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#C5A059] border border-white/10 transition-colors"
                  title="Copiar datos al portapapeles"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action buttons with native luxury styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={downloadIcsFile}
                className="btn-luxury-primary w-full text-center"
              >
                <Download className="w-4 h-4 text-[#09090C]" />
                <span>En Calendario</span>
              </button>

              <button
                onClick={copyBookingReference}
                className="btn-luxury-secondary w-full text-center"
              >
                <Copy className="w-4 h-4 text-[#C5A059]" />
                <span>Copiar Datos</span>
              </button>

              <Link
                to="/admin"
                className="btn-luxury-secondary w-full text-center"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Panel Admin</span>
              </Link>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setCurrentStep(1);
                  setSelectedTime('');
                  setClientName('');
                  setClientPhone('');
                  setClientEmail('');
                  setClientNotes('');
                }}
                className="text-xs text-gray-400 hover:text-white underline underline-offset-4"
              >
                Hacer otra reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

