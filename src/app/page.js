'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';

import ReviewsSection from '@/components/ReviewsSection';
import FaqsSection from '@/components/FaqsSection';

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
    <div className="bg-[#FFF8E7] dark:bg-[#0D0703] min-h-screen">
      <Navbar />
      <Hero />

      {/* Featured Products Section */}
      <main className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8730A]/60 block mb-4">
            Fresh & Ready
          </span>
          <h2
            className="text-3xl font-bold tracking-tight text-[#1A0E05] dark:text-orange-100 sm:text-5xl"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Our Snack Collection
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8B4513]/60 dark:text-orange-300/50 mx-auto font-normal leading-relaxed">
            Handcrafted with love using traditional recipes passed down through generations. Each pack is a celebration of authentic Indian flavors.
          </p>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-[#E8730A]/30" />
            <span className="text-[#E8730A]">✦</span>
            <div className="h-px w-12 bg-[#E8730A]/30" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col animate-pulse rounded-3xl p-4 border border-orange-100 dark:border-orange-900/20">
                <div className="w-full aspect-square bg-orange-100/60 dark:bg-orange-950/30 rounded-2xl mb-5" />
                <div className="space-y-3 px-1">
                  <div className="h-2.5 w-16 bg-orange-100 dark:bg-orange-950/30 rounded-full" />
                  <div className="h-4 w-full bg-orange-100 dark:bg-orange-950/30 rounded-full" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-14 bg-orange-100 dark:bg-orange-950/30 rounded-full" />
                    <div className="h-9 w-24 bg-orange-100 dark:bg-orange-950/30 rounded-full" />
                  </div>
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
          <div className="text-center py-24">
            <div className="text-5xl mb-6">🍪</div>
            <p className="text-[#8B4513]/50 dark:text-orange-400/40 font-medium text-sm uppercase tracking-widest">
              Our fresh batch is being prepared. Check back soon!
            </p>
          </div>
        )}

        {/* View All Button */}
        {!loading && featuredProducts.length > 0 && (
          <div className="text-center mt-14">
            <a
              href="/products"
              className="inline-flex items-center gap-3 bg-[#E8730A] hover:bg-[#F2A52B] text-white py-4 px-10 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-300 shadow-xl shadow-orange-200/50 hover:scale-105 active:scale-95"
            >
              View All Snacks
              <span>→</span>
            </a>
          </div>
        )}
      </main>

      {/* Why THEKUA Banner */}
      <section className="bg-[#1A0E05] py-20 border-y border-orange-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🌿', title: 'Pure & Natural', desc: 'No preservatives or artificial colors' },
              { icon: '🤲', title: 'Handcrafted', desc: 'Made using traditional methods' },
              { icon: '📦', title: 'Safe Delivery', desc: 'Food-grade, airtight packaging' },
              { icon: '🎁', title: 'Gift Ready', desc: 'Perfect for all occasions' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group cursor-default">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#F2A52B] mb-2">{title}</h3>
                <p className="text-xs text-orange-200/40 font-normal leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
      <FaqsSection />
      <Footer />
    </div>
  );
}
