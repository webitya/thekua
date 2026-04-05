'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

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
    <footer className="bg-white text-gray-600 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">THEKUA</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Authentic Indian snacks handcrafted with love and tradition. Bringing the flavors of heritage directly to your home.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href="/products" className="text-sm hover:text-orange-600 transition-colors flex items-center group">
                    {cat}
                    <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-4">
              {[
                { href: '/track-order', label: 'Track Order' },
                { href: '/orders', label: 'My Orders' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-orange-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-orange-600" />
                <span className="text-sm break-all">holisticapproch1998@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-orange-600" />
                <span className="text-sm">+91 72941 68071</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} THEKUA Snacks. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <span>Made with tradition</span>
            <div className="h-1 w-1 bg-gray-300 rounded-full" />
            <span>Delivered nationwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
