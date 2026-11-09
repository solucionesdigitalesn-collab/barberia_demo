import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Onboarding from '../components/Onboarding';
import Navigation from '../components/navigation';
import Hero from '../components/hero';
import Stats from '../components/stats';
import Services from '../components/services';
import Barbers from '../components/barbers';
import Gallery from '../components/gallery';
import About from '../components/about';
import Testimonials from '../components/testimonials';
import Promotions from '../components/promotions';
import Location from '../components/location';
import AdminShowcase from '../components/AdminShowcase';
import Faqs from '../components/faqs';
import Footer from '../components/footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Show the onboarding once per session
    return !sessionStorage.getItem('aureum_onboarding_shown');
  });

  const completeOnboarding = (destination?: string) => {
    sessionStorage.setItem('aureum_onboarding_shown', 'true');
    setShowOnboarding(false);
    if (destination) navigate(destination);
  };

  return (
    <>
      {showOnboarding && (
        <Onboarding
          onSkip={() => completeOnboarding()}
          onFinish={() => completeOnboarding('/login')}
        />
      )}

      <div className="min-h-screen bg-[#08080A] text-[#EDEDF0] flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Hero />
          <Stats />
          <AdminShowcase />
          <Services />
          <Barbers />
          <Gallery />
          <About />
          <Testimonials />
          <Promotions />
          <Location />
          <Faqs />
        </main>
        <Footer />

        {/* Floating Mobile Sticky Booking Bar */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08080A]/95 backdrop-blur-md border-t border-white/[0.08] p-3 px-5 flex items-center justify-between">
          <div>
            <span className="font-serif-luxury text-sm font-medium text-white block leading-none">
              AUREUM
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#C5A059] uppercase">
              HAUTE BARBIER
            </span>
          </div>

          <Link
            to="/reservar"
            className="btn-luxury-primary !py-2.5 !px-5 !text-xs"
          >
            <span>RESERVAR CITA</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
