'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#FFF8E7] dark:bg-[#1A0E05] border-b border-orange-200 dark:border-orange-900/50 ${
      scrolled
        ? 'shadow-lg shadow-orange-100/60 dark:shadow-orange-950/40'
        : 'shadow-sm shadow-orange-50/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 text-[#8B4513] hover:text-[#E8730A] dark:text-orange-200 dark:hover:text-[#F2A52B] transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center md:flex-none absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-[0.15em] uppercase text-[#E8730A] dark:text-[#F2A52B] font-display" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  THEKUA
                </span>
                <span className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#8B4513]/60 dark:text-orange-300/50 -mt-0.5">
                  Artisan Snacks
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-10">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Shop' },
              { href: '/about', label: 'Our Story' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-semibold uppercase tracking-widest text-[#8B4513] dark:text-orange-200 hover:text-[#E8730A] dark:hover:text-[#F2A52B] transition-colors group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E8730A] rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-[#8B4513] hover:text-[#E8730A] dark:text-orange-200 dark:hover:text-[#F2A52B] transition-colors cursor-pointer"
            >
              <span className="sr-only">Open cart</span>
              <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center text-[10px] font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-[#E8730A] rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="p-2 text-[#8B4513] hover:text-[#E8730A] dark:text-orange-200 dark:hover:text-[#F2A52B] transition-colors cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <UserIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-[#FFF8E7] dark:bg-[#1A0E05] border border-orange-100 dark:border-orange-900/40 rounded-2xl shadow-xl shadow-orange-100/60 dark:shadow-orange-950/40 py-2 animate-fade-in z-50 overflow-hidden">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20">
                        <p className="text-[10px] text-[#8B4513]/60 dark:text-orange-400/60 uppercase tracking-widest font-bold">Signed in as</p>
                        <p className="text-sm font-semibold text-[#8B4513] dark:text-orange-200 truncate">{user?.name || 'Guest'}</p>
                      </div>
                      {[
                        { href: '/account', label: 'My Account' },
                        { href: '/orders', label: 'My Orders' },
                        { href: '/track-order', label: 'Track Order' },
                      ].map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          className="block px-4 py-2.5 text-sm text-[#8B4513] dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#E8730A] transition-colors font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-orange-100 dark:border-orange-900/30 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium cursor-pointer"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2.5 text-sm text-[#8B4513] dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#E8730A] transition-colors font-semibold" onClick={() => setProfileOpen(false)}>
                        Login / Sign Up
                      </Link>
                      <Link href="/track-order" className="block px-4 py-2.5 text-sm text-[#8B4513] dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#E8730A] transition-colors font-medium" onClick={() => setProfileOpen(false)}>
                        Track Order
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-[100] ${mobileMenuOpen ? 'visible' : 'invisible'}`} aria-hidden={!mobileMenuOpen}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-[#1A0E05]/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div className={`fixed top-0 left-0 w-[85%] max-w-[320px] h-screen bg-[#FFF8E7] dark:bg-[#120904] shadow-2xl shadow-orange-900/20 transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-orange-100 dark:border-orange-900/30 sticky top-0 z-10 bg-[#FFF8E7] dark:bg-[#120904]">
              <div>
                <span className="text-xl font-black tracking-widest text-[#E8730A] dark:text-[#F2A52B] uppercase" style={{ fontFamily: 'var(--font-playfair), serif' }}>THEKUA</span>
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#8B4513]/50 dark:text-orange-400/50">Artisan Snacks</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#8B4513]/60 hover:text-[#E8730A] dark:text-orange-400 dark:hover:text-[#F2A52B] transition-colors rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow py-8 px-8 space-y-8">
              {[
                { href: '/', label: 'Home', desc: 'Back to homepage' },
                { href: '/products', label: 'Shop', desc: 'Browse all snacks' },
                { href: '/about', label: 'Our Story', desc: 'How we started' },
              ].map(({ href, label, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="block group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="block text-xl font-bold uppercase tracking-widest text-[#8B4513] dark:text-orange-200 group-hover:text-[#E8730A] dark:group-hover:text-[#F2A52B] transition-colors">{label}</span>
                  <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B4513]/40 dark:text-orange-400/40 mt-0.5">{desc}</span>
                </Link>
              ))}
            </nav>

            {/* Footer Section */}
            <div className="p-8 border-t border-orange-100 dark:border-orange-900/30 bg-orange-50/40 dark:bg-orange-950/10">
              <p className="text-[10px] font-bold text-[#8B4513]/50 dark:text-orange-400/50 uppercase tracking-[0.25em] mb-5">Customer Care</p>
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#8B4513]/70 dark:text-orange-300/60">support@thekua.in</p>
                <p className="text-xs font-medium text-[#8B4513]/70 dark:text-orange-300/60">Shipping & Returns</p>
                <div className="pt-4 flex space-x-3">
                  {['IG', 'FB', 'YT'].map((s) => (
                    <div key={s} className="h-8 w-8 rounded-full border border-orange-200 dark:border-orange-800 flex items-center justify-center hover:bg-[#E8730A] hover:border-[#E8730A] hover:text-white transition-all cursor-pointer">
                      <span className="text-[9px] font-bold text-[#8B4513] dark:text-orange-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
