import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft, User, Lock, Sparkles } from 'lucide-react';
import { useBarberStore } from '../hooks/useBarberStore';
import { useToast } from '../components/ui/Toast';
import { DEMO_USERS } from '../services/mockData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAs, loginWithUsername } = useBarberStore();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Por favor introduce tu identificador de usuario');
      return;
    }

    const user = loginWithUsername(username);
    if (user) {
      showToast(`Bienvenido de nuevo, ${user.name}`, 'success');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/barbero/${user.barberId || 'barber-1'}`);
      }
    } else {
      setError('Usuario no reconocido. Prueba con admin, marcos, julian, mateo o diego.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    const user = loginAs(userId);
    if (user) {
      showToast(`Acceso directo concedido como ${user.name}`, 'success');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/barbero/${user.barberId || 'barber-1'}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#09090C] text-[#FAF6EE] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Página Principal</span>
          </Link>
        </div>

        {/* Monogram Crest */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#14141B] border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#C5A059] font-serif-luxury text-xl font-bold shadow-lg shadow-[#C5A059]/10">
            A
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Portal Staff & Gerencia
          </h2>
          <p className="text-xs text-gray-400">
            AUREUM Barber Club • Acceso Administrativo & Barberos
          </p>
        </div>

        {/* Card Box */}
        <div className="luxury-panel p-6 sm:p-8 space-y-6 border border-[#C5A059]/30">
          {/* Quick Access Badges for Demo */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Rápido Demo (1 Clic)</span>
            </span>

            {/* Admin Quick Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('user-admin')}
              className="w-full p-3.5 rounded-xl border border-[#C5A059]/40 bg-gradient-to-r from-[#181824] to-[#12121A] hover:border-[#C5A059] text-left flex items-center justify-between group transition-all shadow-md"
            >
              <div>
                <span className="text-xs font-bold text-white group-hover:text-[#C5A059] block">
                  Alexander Sterling
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                  Administrador General • Acceso Completo
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C5A059] transition-transform group-hover:translate-x-1" />
            </button>

            {/* Barbers Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {DEMO_USERS.filter((u) => u.role === 'barber').map((bUser) => (
                <button
                  key={bUser.id}
                  type="button"
                  onClick={() => handleQuickLogin(bUser.id)}
                  className="p-3 rounded-xl border border-white/10 hover:border-[#C5A059]/50 text-left transition-all bg-white/5 hover:bg-white/10 flex items-center gap-2.5"
                >
                  <img
                    src={bUser.avatar}
                    alt={bUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#C5A059]/30 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate">
                      {bUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[#C5A059] uppercase block font-medium">
                      Barbero
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#121217] px-3 text-gray-400">O ingresa manualmente</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, marcos, julian, mateo o diego"
                  className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Cualquier clave para la demo"
                  className="w-full bg-[#14141B] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-luxury-primary w-full text-center !py-3 !text-xs font-bold"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-4 h-4 text-[#09090C]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
