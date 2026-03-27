'use client';

import { Star, Check, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Anita Verma",
    location: "Lucknow",
    rating: 5,
    text: "The thekua tasted exactly like my nani used to make! Perfectly crisp with just the right amount of jaggery. Transported me back to childhood.",
    date: "3 days ago",
    verified: true
  },
  {
    id: 2,
    name: "Rajan Sharma",
    location: "Patna",
    rating: 5,
    text: "Ordered gujia for Holi and the whole family loved it. The filling was perfect — not too sweet, not too dry. Will definitely order again!",
    date: "1 week ago",
    verified: true
  },
  {
    id: 3,
    name: "Sunita Mishra",
    location: "Varanasi",
    rating: 5,
    text: "The nimkin is absolutely addictive! Crispy, flavorful, and packed so well. Even arrived fresh after 3 days of transit. Impressive quality.",
    date: "2 days ago",
    verified: true
  },
  {
    id: 4,
    name: "Pradeep Kumar",
    location: "Delhi",
    rating: 5,
    text: "Best mathri I've had outside of home. The packaging is beautiful — sent it as a Diwali gift and everyone was impressed. A truly premium experience.",
    date: "5 days ago",
    verified: true
  }
];

function ReviewCard({ review }) {
  return (
    <div className="bg-white dark:bg-[#1A0E05]/60 p-7 rounded-3xl border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-xl hover:shadow-orange-100/60 dark:hover:shadow-orange-950/30 transition-all duration-500 flex flex-col h-full relative group hover:-translate-y-1">
      {/* Decorative Quote */}
      <div className="absolute top-5 right-7 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
        <Quote size={72} strokeWidth={1} className="text-[#E8730A]" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} size={14} className="fill-[#E8730A] text-transparent" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-[#8B4513]/80 dark:text-orange-200/70 text-sm leading-relaxed mb-7 flex-grow font-normal italic">
        "{review.text}"
      </p>

      {/* Reviewer */}
      <div className="flex items-center justify-between border-t border-orange-50 dark:border-orange-900/20 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8730A] to-[#F2A52B] flex items-center justify-center text-xs font-black uppercase text-white shadow-sm">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-[#1A0E05] dark:text-orange-100 tracking-tight">{review.name}</h4>
              {review.verified && (
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={9} className="text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#8B4513]/50 dark:text-orange-400/50 font-medium uppercase tracking-widest">{review.location} · {review.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-[#FFF8E7] dark:bg-[#120904] overflow-hidden border-t border-orange-100/60 dark:border-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8730A]/60 mb-4 block">Happy Customers</span>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A0E05] dark:text-orange-100 mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            What Our <span className="text-[#E8730A]">Snack Lovers</span> Say
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#E8730A]/30" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#E8730A] text-transparent" />
              ))}
            </div>
            <div className="h-px w-8 bg-[#E8730A]/30" />
          </div>
          <p className="text-sm font-bold text-[#8B4513]/50 dark:text-orange-400/50 uppercase tracking-widest">4.9/5 · Based on 800+ Reviews</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 pt-10 border-t border-orange-100/60 dark:border-orange-900/20 flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { top: 'No', bottom: 'Preservatives' },
            { top: '100%', bottom: 'Vegetarian' },
            { top: 'Hygiene', bottom: 'Certified' },
            { top: 'Pan-India', bottom: 'Delivery' },
          ].map(({ top, bottom }) => (
            <div key={bottom} className="text-center group cursor-default">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8730A]/60 group-hover:text-[#E8730A] transition-colors mb-0.5">{top}</p>
              <p className="text-xs font-bold uppercase text-[#8B4513]/50 dark:text-orange-400/40 group-hover:text-[#8B4513] dark:group-hover:text-orange-300 transition-colors">{bottom}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
