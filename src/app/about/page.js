'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function About() {
  return (
    <div className="bg-[#FFF8E7] dark:bg-[#0D0703] min-h-screen">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#1A0E05]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.webp"
              alt="THEKUA – Traditional Indian Snacks"
              fill
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0E05]/60 via-[#1A0E05]/20 to-[#1A0E05]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8730A]/10 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] text-[#F2A52B]/60 mb-6 block">
              ✦ Established 2024 ✦
            </span>
            <h1
              className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              THEKUA <span className="text-[#E8730A]">Story</span>
            </h1>
            <p className="text-base md:text-xl text-orange-200/60 font-medium uppercase tracking-[0.25em] max-w-xl mx-auto">
              Born from grandma's kitchen, delivered to your heart.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8730A]/60">Our Beginning</span>
                <h2
                  className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A0E05] dark:text-orange-100 leading-tight"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  Made with Love, <br />Rooted in Tradition
                </h2>
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#E8730A] to-[#F2A52B]" />
              </div>

              <div className="space-y-5 text-[#8B4513]/70 dark:text-orange-300/60 text-base font-normal leading-relaxed">
                <p className="text-[#1A0E05] dark:text-orange-100 font-semibold text-lg">
                  THEKUA was born from a simple longing — the taste of home that no restaurant or supermarket shelf could replicate.
                </p>
                <p>
                  We started in a small kitchen in Bihar, recreating the recipes our grandmothers made during Chhath Puja, Diwali, and Holi. Thekua, Gujia, Nimkin, Mathri — each snack carries a story, a memory, and a celebration.
                </p>
                <p>
                  Today, we handcraft every batch with the same devotion, using only the finest natural ingredients — pure ghee, wholesome wheat, fragrant cardamom, and golden jaggery — the same way it has always been done.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-orange-100 dark:border-orange-900/30">
                {[
                  { icon: '🌾', title: 'Pure Ingredients', sub: 'No additives' },
                  { icon: '🤲', title: 'Handcrafted', sub: 'Small batches' },
                  { icon: '💛', title: 'With Love', sub: 'Every time' },
                ].map(({ icon, title, sub }) => (
                  <div key={title} className="space-y-2 group text-center sm:text-left">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#1A0E05] dark:text-orange-100">{title}</h3>
                    <p className="text-[10px] text-[#8B4513]/50 dark:text-orange-400/40 uppercase font-bold tracking-wider">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Card */}
            <div className="relative h-[500px] lg:h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-200/40 dark:shadow-orange-950/30 order-1 lg:order-2 border border-orange-100 dark:border-orange-900/30">
              <Image
                src="/hero.webp"
                alt="THEKUA Artisan Snacks being made"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E05]/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-[#1A0E05]/70 backdrop-blur-md border border-[#E8730A]/20">
                <p className="text-white text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                  "Every piece of thekua we make is an act of love and memory."
                </p>
                <span className="text-[#F2A52B]/70 text-[9px] font-bold uppercase tracking-widest block mt-2">— THEKUA Philosophy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-[#1A0E05] py-28 border-y border-orange-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-20">
            <div className="space-y-5">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8730A]/60">Our Promise</span>
              <h2
                className="text-3xl md:text-6xl font-bold uppercase tracking-tight text-white"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                Crafted for <span className="text-[#E8730A]">Taste</span>
              </h2>
              <p className="text-sm text-orange-200/40 font-bold uppercase tracking-[0.4em]">The THEKUA Standard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  num: '1',
                  title: 'Authentic Recipes',
                  desc: 'Every snack follows century-old recipes from the kitchens of Bihar and UP, unchanged and uncompromised.',
                  featured: false,
                },
                {
                  num: '2',
                  title: 'Premium Ingredients',
                  desc: 'We source only the finest — stone-ground wheat, farm-fresh ghee, pure jaggery, and handpicked spices. No shortcuts.',
                  featured: true,
                },
                {
                  num: '3',
                  title: 'Freshness Guaranteed',
                  desc: 'Each batch is made to order in small quantities, vacuum-sealed and delivered within days — never sitting on a shelf for weeks.',
                  featured: false,
                },
              ].map(({ num, title, desc, featured }) => (
                <div
                  key={num}
                  className={`p-10 rounded-3xl space-y-5 group hover:scale-[1.02] transition-all duration-300 ${
                    featured
                      ? 'bg-[#E8730A] text-white shadow-2xl shadow-orange-900/40 scale-[1.02]'
                      : 'bg-[#2A1508]/60 border border-orange-900/30 hover:border-[#E8730A]/40'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mx-auto ${featured ? 'bg-white text-[#E8730A]' : 'bg-[#E8730A] text-white'}`}>{num}</div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${featured ? 'text-white' : 'text-orange-100'}`}>{title}</h3>
                  <p className={`text-xs leading-relaxed font-normal ${featured ? 'text-orange-100/80' : 'text-orange-300/50'}`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 text-center relative overflow-hidden bg-[#FFF8E7] dark:bg-[#0D0703]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E8730A]/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative">
            <span className="text-5xl block mb-6">🍪</span>
            <h2
              className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-[#1A0E05] dark:text-orange-100 mb-6 drop-shadow-sm"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Taste the Tradition
            </h2>
            <p className="text-sm text-[#8B4513]/60 dark:text-orange-400/50 font-medium uppercase tracking-[0.3em] mb-12 max-w-md mx-auto">
              Order your favourite Indian snacks — fresh, traditional, and delivered with love.
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="bg-[#E8730A] hover:bg-[#F2A52B] text-white px-12 py-5 uppercase tracking-[0.4em] text-[11px] font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-orange-200/60 dark:shadow-orange-900/30 cursor-pointer"
            >
              Shop Our Snacks
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
