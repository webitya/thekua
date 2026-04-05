'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const HIGHLIGHTS = ['Thekua', 'Gujia', 'Nimkin', 'Mathri', 'Laddoo'];

export default function Hero() {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentHighlight((prev) => (prev + 1) % HIGHLIGHTS.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0703]">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 scale-110">
        <Image
          src="/snacks_hero.png"
          alt="THEKUA – Artisan Indian Snacks"
          fill
          className="object-cover opacity-60 animate-ken-burns"
          priority
        />
        {/* Layered cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0703]/80 via-transparent to-[#0D0703] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 z-10" />
      </div>

      {/* Floating decorative glow elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#E8730A]/10 blur-[120px] rounded-full pointer-events-none animate-warm-glow z-0" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[#F2A52B]/5 blur-[100px] rounded-full pointer-events-none animate-warm-glow z-0" style={{ animationDelay: '2s' }} />

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Main Heading with Reveal Animation */}
        <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black text-white tracking-tighter uppercase leading-[0.8] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            THEKUA
          </h1>
          <div className="flex items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#F2A52B]" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.6em] text-[#F2A52B]">Artisan Indian Snacks</span>
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#F2A52B]" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {/* Fresh label removed */}
          <div className="min-w-[160px] sm:min-w-[240px] h-14 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 px-6">
            <span
              className="text-xl sm:text-3xl font-black text-[#F2A52B] uppercase tracking-tight transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                fontFamily: 'var(--font-playfair), serif',
              }}
            >
              {HIGHLIGHTS[currentHighlight]}
            </span>
          </div>
          {/* Daily label removed */}
        </div>

        {/* Sub-description with Reveal */}
        <p className="text-xs sm:text-sm text-orange-100/50 font-medium uppercase tracking-[0.4em] max-w-2xl mx-auto mb-14 leading-loose opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          Honoring centuries-old traditions with premium ingredients.<br className="hidden sm:block" /> Experience the soul of India in every bite.
        </p>

        {/* CTA Buttons with Reveal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-4 bg-[#E8730A] hover:bg-[#F2A52B] text-white py-5 px-12 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_15px_40px_rgba(232,115,10,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Shop Collection</span>
            <span className="relative z-10 text-xl group-hover:translate-x-1 transition-transform">→</span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white py-5 px-12 rounded-full font-bold text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 active:scale-95"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF8E7] dark:from-[#0D0703] to-transparent z-20" />
    </div>
  );
}
