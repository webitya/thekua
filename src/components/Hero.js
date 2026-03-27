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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A0E05]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.webp"
          alt="THEKUA – Premium Indian Snacks & Sweets"
          fill
          className="object-cover opacity-50"
          priority
        />
        {/* Layered overlays for warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0E05]/70 via-[#1A0E05]/20 to-[#1A0E05]/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8730A]/10 via-transparent to-[#8B4513]/10 z-10" />
      </div>

      {/* Floating decorative orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#E8730A]/15 blur-[100px] rounded-full pointer-events-none animate-warm-glow z-0" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-[#F2A52B]/10 blur-[80px] rounded-full pointer-events-none animate-warm-glow z-0" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#E8730A]/15 backdrop-blur-sm border border-[#E8730A]/30 rounded-full px-4 py-2 mb-8">
          <span className="text-[#F2A52B] text-lg">✦</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-200">Handcrafted Since 2024</span>
          <span className="text-[#F2A52B] text-lg">✦</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-3 mb-6">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            THEKUA
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E8730A]" />
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#F2A52B]">Artisan Indian Snacks</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E8730A]" />
          </div>
        </div>

        {/* Animated Snack Rotator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-sm sm:text-base font-medium text-orange-200/70 uppercase tracking-widest">Fresh</span>
          <div className="min-w-[140px] sm:min-w-[200px] h-12 flex items-center justify-center">
            <span
              className="text-2xl sm:text-3xl font-black text-[#F2A52B] uppercase tracking-tight transition-all duration-400"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                fontFamily: 'var(--font-playfair), serif',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              {HIGHLIGHTS[currentHighlight]}
            </span>
          </div>
          <span className="text-sm sm:text-base font-medium text-orange-200/70 uppercase tracking-widest">Daily</span>
        </div>

        {/* Sub-description */}
        <p className="text-sm sm:text-base text-orange-100/60 font-medium uppercase tracking-[0.3em] max-w-xl mx-auto mb-12 leading-relaxed">
          Traditional recipes. Premium ingredients. Delivered to your door.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-[#E8730A] hover:bg-[#F2A52B] text-white py-4 px-10 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl shadow-orange-900/40 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Shop Now</span>
            <span className="text-lg">→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white py-4 px-10 rounded-full font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Our Story
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: '🌿', label: 'Pure & Natural' },
            { icon: '🤲', label: 'Handcrafted' },
            { icon: '📦', label: 'Pan-India Delivery' },
            { icon: '⭐', label: '4.9/5 Rated' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-orange-200/60">
              <span className="text-lg">{icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF8E7] dark:from-[#0D0703] to-transparent z-20" />
    </div>
  );
}
