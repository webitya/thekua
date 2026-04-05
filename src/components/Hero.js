'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

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
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-16 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12 lg:py-16">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight leading-[1.05] animate-fade-in">
              Homemade <br />
              <span className="text-orange-600 italic font-medium">Happiness.</span>
            </h1>

            <div className="h-12 flex items-center justify-center lg:justify-start">
              <span className="text-xl sm:text-2xl font-medium text-gray-400 mr-3">Love for</span>
              <div className="relative overflow-hidden h-10 flex items-center">
                <span
                  className="text-2xl sm:text-4xl font-black text-gray-900 transition-all duration-500 ease-in-out inline-block"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(15px)',
                  }}
                >
                  {HIGHLIGHTS[currentHighlight]}
                </span>
              </div>
            </div>

            <p className="text-base text-gray-500 font-medium leading-relaxed animate-fade-in max-w-lg mx-auto lg:mx-0">
              Authentic Indian snacks, handcrafted in small batches with pure ingredients. Delivered fresh to your doorstep nationwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-fade-in">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-3.5 px-8 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-orange-100 hover:scale-[1.02] active:scale-95"
              >
                Shop Collection
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-100 hover:bg-gray-50 text-gray-900 py-3.5 px-8 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95"
              >
                Our Legacy
              </Link>
            </div>

            {/* Features Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 opacity-50 animate-fade-in">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-orange-600" />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Truck size={14} className="text-orange-600" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Zap size={14} className="text-orange-600" />
                <span>Freshly Prepared</span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-fade-in">
            <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-100 border-4 border-white group">
              <Image
                src="/snacks_hero.png"
                alt="Traditional Indian Snacks"
                fill
                className="object-cover transition-transform duration-[15s] group-hover:scale-110"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
                <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-1">Featured Artisanal Snack</p>
                <p className="text-lg font-bold text-white">The Original Jaggery Thekua</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
