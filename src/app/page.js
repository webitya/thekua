'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/ReviewsSection';
import FaqsSection from '@/components/FaqsSection';
import { ArrowRight, MoveRight, ShoppingBag, Leaf, Flame, ShieldCheck, Truck, UtensilsCrossed, PackageSearch, Timer } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          setFeaturedProducts(json.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <Navbar />
      
      {/* 1. Hero Section (White) */}
      <Hero />

      {/* 2. Brand Values (Slightly Gray) */}
      <section className="bg-gray-50 py-10 border-y border-gray-100/50 shadow-inner shadow-gray-200/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between gap-6">
          {[
            { label: 'Pure Ingredients', icon: Leaf, desc: 'No Preservatives' },
            { label: 'Traditional Craft', icon: Flame, desc: 'Small Batches' },
            { icon: ShieldCheck, label: 'Quality First', desc: '100% Natural' },
            { icon: Truck, label: 'Express Delivery', desc: 'Pan India' },
          ].map((v) => (
            <div key={v.label} className="group flex items-center gap-4 transition-all duration-300">
              <div className="p-3 bg-white rounded-2xl border border-gray-100 text-orange-600 shadow-sm transition-all group-hover:bg-orange-600 group-hover:text-white group-hover:-translate-y-1">
                <v.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-orange-600 transition-colors">{v.label}</span>
                <span className="text-xs font-bold text-gray-900">{v.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products (White) */}
      <main className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Our <span className="text-orange-600 italic font-medium underline decoration-orange-100 underline-offset-8">Bestsellers.</span>
              </h2>
              <p className="mt-4 text-base text-gray-500 font-medium leading-relaxed">
                Handcrafted traditional snacks, prepared with authentic recipes and delivered fresh.
              </p>
            </div>
            
            <a
              href="/products"
              className="group inline-flex items-center gap-2 text-[10px] font-black text-gray-900 border-b-2 border-orange-600 pb-1 hover:text-orange-600 transition-colors uppercase tracking-[0.2em]"
            >
              Full Collection
              <MoveRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col animate-pulse rounded-2xl p-3 border border-gray-50">
                  <div className="w-full aspect-square bg-gray-100 rounded-xl mb-4" />
                  <div className="space-y-2 px-1">
                    <div className="h-3 w-16 bg-gray-100 rounded-full" />
                    <div className="h-4 w-full bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-1">Restocking Soon</h3>
              <p className="text-xs text-gray-500 font-medium">We are preparing fresh batches.</p>
            </div>
          )}
        </div>
      </main>

      {/* 4. Simple Process (Slightly Gray) */}
      <section className="bg-gray-50 py-20 border-y border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {[
              { icon: UtensilsCrossed, title: 'Handcrafted', desc: 'Made using age-old ancestral recipes from the heart of Bihar.' },
              { icon: PackageSearch, title: 'Quality Checked', desc: 'Every snack undergoes strict quality control for purity and taste.' },
              { icon: Timer, title: 'Made to Order', desc: 'We prepare snacks once confirmed for maximum freshness.' },
            ].map((p, i) => (
              <div key={p.title} className="group flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white text-orange-600 flex items-center justify-center mb-1 shadow-sm border border-gray-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-orange-100">
                  <p.icon size={28} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[250px]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Reviews (White) */}
      <ReviewsSection />
      
      {/* 6. FAQs (Slightly Gray) */}
      <div className="bg-gray-50/50">
        <FaqsSection />
      </div>

      <Footer />
    </div>
  );
}
