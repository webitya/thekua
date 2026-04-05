'use client';

import { Star, Check, User, ShieldCheck, Leaf, Truck, Heart } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Anita Verma",
    location: "Lucknow",
    rating: 5,
    text: "The thekua tasted exactly like my nani used to make! Perfectly crisp with just the right amount of jaggery. Transported me back to childhood.",
    date: "March 2024",
    verified: true
  },
  {
    id: 2,
    name: "Rajan Sharma",
    location: "Patna",
    rating: 5,
    text: "Ordered gujia for Holi and the whole family loved it. The filling was perfect — not too sweet, not too dry. Will definitely order again!",
    date: "Feb 2024",
    verified: true
  },
  {
    id: 3,
    name: "Sunita Mishra",
    location: "Varanasi",
    rating: 5,
    text: "The nimkin is absolutely addictive! Crispy, flavorful, and packed so well. Even arrived fresh after 3 days of transit. Impressive quality.",
    date: "Jan 2024",
    verified: true
  }
];

function ReviewCard({ review }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/30 flex flex-col h-full relative group">
      <div className="flex gap-1 mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} size={14} className="fill-orange-600 text-transparent" />
        ))}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow font-medium">
        "{review.text}"
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
            <User size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-gray-900">{review.name}</h4>
              {review.verified && (
                <Check size={12} className="text-green-500" />
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{review.location} · {review.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-white overflow-hidden border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Trusted by <span className="text-orange-600 italic font-medium">Snack Lovers.</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className="fill-gray-200 text-transparent" />
              ))}
            </div>
            <span>800+ Verified Reviews</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Minimal Trust Badges */}
        <div className="mt-16 pt-10 border-t border-gray-50 flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { label: 'All Natural', icon: Leaf },
            { label: 'Handcrafted', icon: Heart },
            { label: 'Certified', icon: ShieldCheck },
            { label: 'Fast Delivery', icon: Truck },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 grayscale hover:grayscale-0 transition-all">
              <Icon size={16} className="text-orange-600" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
