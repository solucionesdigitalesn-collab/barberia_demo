import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashLoaderProps {
  onComplete: () => void;
}

export default function SplashLoader({ onComplete }: SplashLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Smooth realistic luxury progress counter
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 900);
          }, 300);
          return 100;
        }
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08080A] text-[#FAF6EE] p-8 sm:p-14 select-none cursor-wait"
        >
          {/* Top metadata */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.3em] uppercase text-gray-500">
            <span>AUREUM BARBER CLUB</span>
            <span>MADRID • SALAMANCA</span>
          </div>

          {/* Center Monogram & Title */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Minimalist Crest */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative mb-6"
            >
              <div className="w-16 h-16 rounded-full border border-[#C5A059]/40 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#C5A059]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>
              </div>
              <div className="absolute -inset-2 border border-[#C5A059]/15 rounded-full animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif-luxury text-3xl sm:text-5xl font-light tracking-[0.2em] text-[#FAF6EE]"
            >
              AUREUM
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.45em] text-[#C5A059] font-medium"
            >
              HAUTE COIFFURE MASCULINE • ATELIER
            </motion.p>
          </div>

          {/* Bottom Progress Counter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between font-mono text-xs text-gray-400">
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500">
                Iniciando Santuario
              </span>
              <span className="text-sm font-semibold text-[#C5A059] tabular-nums">
                {progress < 10 ? `00${progress}` : progress < 100 ? `0${progress}` : progress}%
              </span>
            </div>

            {/* Ultra-thin hairline progress bar */}
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#9A7730] via-[#C5A059] to-[#E5C158]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

