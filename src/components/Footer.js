'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [categories, setCategories] = useState(['Thekua', 'Gujia', 'Nimkin', 'Mathri', 'Laddoo']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          const uniqueTypes = [...new Set(json.data.map(p => p.type))];
          if (uniqueTypes.length > 0) setCategories(uniqueTypes);
        }
      } catch (error) {
        console.error('Failed to fetch categories for footer:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-[#1A0E05] text-orange-100 border-t border-orange-900/40">
      {/* Top decorative band */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8B4513] via-[#E8730A] to-[#F2A52B]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <h3
                className="text-3xl font-black text-[#F2A52B] uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                THEKUA
              </h3>
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-orange-400/50 mt-1">
                Artisan Indian Snacks
              </p>
            </div>
            <p className="text-orange-200/60 text-sm leading-relaxed max-w-sm">
              Bringing the warmth of traditional Indian kitchens to your doorstep. Every bite carries the love, heritage, and authentic flavors of our homeland.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {['IG', 'FB', 'YT', 'TW'].map((s) => (
                <div
                  key={s}
                  className="h-9 w-9 rounded-full border border-orange-800/60 flex items-center justify-center hover:bg-[#E8730A] hover:border-[#E8730A] transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-[9px] font-black text-orange-400 group-hover:text-white">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-[10px] font-black mb-6 text-orange-400/60 uppercase tracking-[0.3em]">Our Snacks</h4>
            <ul className="space-y-3 text-sm text-orange-200/60">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href="/products"
                    className="hover:text-[#F2A52B] transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="h-px w-3 bg-[#E8730A]/30 group-hover:w-5 group-hover:bg-[#E8730A] transition-all duration-300" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <h4 className="text-[10px] font-black mb-6 text-orange-400/60 uppercase tracking-[0.3em]">Help & Info</h4>
            <ul className="space-y-3 text-sm text-orange-200/60">
              {[
                { href: '/track-order', label: 'Track Order' },
                { href: '/orders', label: 'My Orders' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-[#F2A52B] transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="h-px w-3 bg-[#E8730A]/30 group-hover:w-5 group-hover:bg-[#E8730A] transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 rounded-2xl bg-[#E8730A]/10 border border-[#E8730A]/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F2A52B] mb-1">Contact Us</p>
              <p className="text-xs text-orange-200/60 font-medium">support@thekua.in</p>
              <p className="text-xs text-orange-200/60 font-medium mt-1">+91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-orange-900/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-orange-200/30 font-medium">
            © {new Date().getFullYear()} THEKUA Artisan Snacks. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[#E8730A] text-sm">✦</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-200/30">Made with love in India</span>
            <span className="text-[#E8730A] text-sm">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
