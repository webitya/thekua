'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Leaf, Heart, Award, ArrowRight, Star, ShieldCheck, Target, Coffee, Utensils, History, MapPin, Users, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <main>
        {/* Simple Hero Section */}
        <section className="relative pt-20 pb-12 px-4 border-b border-gray-50">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
              Traditional Snacks, <br />
              <span className="text-orange-600 italic font-medium">Modern Standards.</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
              We are on a mission to preserve the authentic flavors of India's heritage, one handcrafted batch at a time.
            </p>
          </div>
        </section>

        {/* Dense Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Our Heritage</h2>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-[0.2em]">The Legacy of Home</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600 text-xs md:text-sm font-medium leading-relaxed">
                <div className="space-y-4">
                  <p className="text-gray-900 font-bold">
                    THEKUA was born from a simple longing — the taste of home that no supermarket shelf could replicate.
                  </p>
                  <p>
                    Started in 2024, our journey began in a family kitchen where recipes were whispered from one generation to the next. We realized that the "soul" of Indian snacks was being lost in mass production.
                  </p>
                </div>
                <div className="space-y-4">
                  <p>
                    We decided to pivot back to the basics: wood-fired aromas, stone-ground flour, and the patience of slow-cooking. Our founders personally source every kilo of jaggery and every liter of ghee.
                  </p>
                  <p>
                    Every Thekua, Nimkin, and Gujia we ship is a testament to this uncompromising standard of purity and taste.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-50">
                {[
                  { icon: Target, title: 'Our Mission', sub: 'Purity over profit' },
                  { icon: Utensils, title: 'The Process', sub: 'Traditional craft' },
                  { icon: Coffee, title: 'The Secret', sub: 'Grandma\'s recipes' },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl flex-1 min-w-[150px]">
                    <Icon size={18} className="text-orange-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-[10px] font-bold uppercase text-gray-900 tracking-wider whitespace-nowrap">{title}</h3>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Image Card */}
            <div className="relative h-[300px] lg:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl shadow-gray-100 border border-gray-100">
              <Image
                src="/snacks_hero.png"
                alt="Our Tradition"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <h4 className="text-white text-xs font-bold italic mb-1">Guaranteed Authenticity</h4>
                <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">From our heart to your home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Journey Timeline - NEW SECTION */}
        <section className="bg-gray-50/50 py-16 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/3 space-y-4 text-center md:text-left">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <History size={24} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase">The Journey</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Our Mile Stones</p>
              </div>
              <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { year: '2023', title: 'The Inspiration', desc: 'The first batch of Thekua was made in a humble home kitchen for friends and family.' },
                  { year: '2024', title: 'The Launch', desc: 'THEKUA brand was officially born with a mission to bring authentic snacks to all of India.' },
                  { year: 'Today', title: 'Growing Community', desc: 'Deliver nationwide, connecting thousands to their nostalgic taste of home.' },
                ].map((item) => (
                  <div key={item.year} className="relative pl-8 border-l border-orange-200 py-1">
                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-orange-600 shadow-lg shadow-orange-200" />
                    <span className="text-xs font-black text-orange-600 mb-1 block tracking-widest">{item.year}</span>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founders Vision - NEW SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-orange-600 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <Star size={12} />
                  <span>Founders Vision</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight italic">
                  "We don't just sell snacks, we sell a piece of our heritage."
                </h3>
                <p className="text-sm md:text-lg text-orange-100 font-medium leading-relaxed max-w-2xl opacity-90">
                  Our goal is to build THEKUA into more than a brand. We want it to be a bridge between a fast-paced modern world and the warm, patient recipes of our ancestors. Purity is not a feature for us—it is our only path.
                </p>
                <div className="pt-4 flex flex-wrap gap-8 items-center border-t border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Authentic Roots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Village Artisans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section - NEW SECTION */}
        <section className="py-16 bg-white border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Empowering Artisans</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Beyond the taste</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Artisans', value: '15+', icon: Utensils, desc: 'Skilled women from local villages' },
                { label: 'Recipes', value: '40+', icon: History, desc: 'Historical family heritage' },
                { label: 'Pure Ghee', value: '100%', icon: Sparkles, desc: 'Purest cow ghee used' },
                { label: 'Community', value: '5K+', icon: Users, desc: 'Happy snack lovers daily' },
              ].map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-gray-50 space-y-3 transition-all hover:bg-orange-50 hover:shadow-xl hover:shadow-orange-100/30 group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 text-orange-600 flex items-center justify-center mx-auto group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <stat.icon size={20} />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{stat.label}</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simpler CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight italic">
              Taste the True India.
            </h2>
            <button
              onClick={() => window.location.href = '/products'}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white px-8 py-3.5 uppercase tracking-widest text-[9px] font-bold rounded-xl transition-all shadow-lg shadow-gray-200"
            >
              Start Shopping
              <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
