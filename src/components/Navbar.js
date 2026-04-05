'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  Search, 
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              THEKUA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Shop' },
              { href: '/about', label: 'Our Story' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 md:space-x-4">
            
            {/* Outlined Fixed Desktop Search */}
            <div className="hidden lg:flex items-center relative group">
              <div className="absolute left-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors">
                <Search size={15} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-[11px] font-bold text-gray-900 w-64 focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all outline-none placeholder:text-gray-300 placeholder:font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-gray-100"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Mobile/Tablet Search Trigger (Overlay) */}
            <div className="lg:hidden">
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-orange-600 transition-all cursor-pointer group"
              >
                <Search size={18} className="group-hover:scale-110 transition-transform" />
              </button>

              {/* Keep Search Overlay for Mobile */}
              {searchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
                  <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-2 overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center px-4 h-14">
                      <Search size={22} className="text-gray-400 mr-4" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search our traditional snacks (Thekua, Gujia...)"
                        className="flex-grow bg-transparent border-none outline-none text-base font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <div className="w-[1px] h-6 bg-gray-100 mx-2" />
                      <button 
                        onClick={() => setSearchOpen(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 px-2"
                      >
                        Esc
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-500 hover:text-orange-600 transition-all cursor-pointer group"
            >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-orange-600 rounded-full shadow-lg shadow-orange-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-1 p-2 text-gray-500 hover:text-orange-600 transition-all cursor-pointer group"
              >
                <User size={18} className="group-hover:scale-110 transition-transform" />
                <ChevronDown size={12} className={`hidden md:block transition-transform duration-200 opacity-30 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {isAuthenticated ? (
                      <div>
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                          <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Member Since 2024</p>
                          <p className="text-sm font-bold text-gray-900 truncate mt-1">{user?.name || 'User'}</p>
                        </div>
                        {[
                          { href: '/account', label: 'My Account' },
                          { href: '/orders', label: 'My Orders' },
                        ].map(({ href, label }) => (
                          <Link
                            key={href}
                            href={href}
                            className="block px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors uppercase tracking-widest"
                            onClick={() => setProfileOpen(false)}
                          >
                            {label}
                          </Link>
                        ))}
                        <div className="mt-1 pt-1 border-t border-gray-50">
                          <button
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 transition-colors cursor-pointer uppercase tracking-[0.2em]"
                          >
                            End Session
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        <Link 
                          href="/login" 
                          className="block w-full py-3 px-4 text-center bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
                          onClick={() => setProfileOpen(false)}
                        >
                          Unlock Account
                        </Link>
                        <Link 
                          href="/track-order" 
                          className="block text-center w-full py-2.5 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest"
                          onClick={() => setProfileOpen(false)}
                        >
                          Trace Parcel
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer border border-transparent hover:border-gray-50 rounded-lg"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Popup */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <span className="text-xl font-bold text-gray-900">THEKUA</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-grow p-6 space-y-6">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop' },
                { href: '/about', label: 'Our Story' },
                { href: '/track-order', label: 'Track Order' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-gray-50 bg-gray-50">
              <p className="text-sm font-semibold text-gray-900 mb-4">Customer Support</p>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 underline">support@thekua.in</p>
                <p className="text-xs text-gray-500">+91 72941 68071</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
