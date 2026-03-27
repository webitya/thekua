'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    id: 1,
    question: "How long does shipping typically take?",
    answer: "Orders are processed within 24-48 hours. Domestic shipping within India usually takes 3-5 business days. We use secure, food-grade packaging to ensure your snacks arrive fresh and intact."
  },
  {
    id: 2,
    question: "Are your snacks made fresh and preservative-free?",
    answer: "Yes! Our products are handcrafted in small batches using traditional recipes and only natural ingredients. We never use artificial preservatives or colors. Each order is freshly prepared to retain maximum taste and freshness."
  },
  {
    id: 3,
    question: "What is your return policy?",
    answer: "Since our snacks are edible goods, we do not accept returns. However, if your order arrives damaged or incorrect, please contact us within 48 hours with photos and we will arrange a full replacement or refund immediately."
  },
  {
    id: 4,
    question: "Do you ship pan-India?",
    answer: "Yes, we deliver to all major cities and towns across India. Shipping costs are calculated at checkout based on your pin code and order weight. Free shipping is available on orders above ₹499."
  },
  {
    id: 5,
    question: "How can I track my order?",
    answer: "Once your order is dispatched, you'll receive an SMS and email with a tracking link. You can also track your parcel directly from the 'Track Order' section in your account dashboard."
  },
  {
    id: 6,
    question: "Can I place bulk or gifting orders?",
    answer: "Absolutely! We specialize in festive gifting and bulk orders for weddings, corporate events, and celebrations. Reach out to us at support@thekua.in for customized packaging and bulk pricing."
  }
];

function FaqItem({ faq, isOpen, toggle }) {
  return (
    <div className={`border-b border-orange-100/60 dark:border-orange-900/20 transition-all duration-500 ${isOpen ? 'bg-orange-50/60 dark:bg-orange-950/20' : ''}`}>
      <button
        onClick={toggle}
        className="w-full py-6 px-5 sm:px-8 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-300 pr-4 ${isOpen ? 'text-[#E8730A] dark:text-[#F2A52B]' : 'text-[#8B4513]/70 dark:text-orange-300/70 group-hover:text-[#8B4513] dark:group-hover:text-orange-200'}`}>
          {faq.question}
        </span>
        <div className={`flex-shrink-0 p-2 rounded-full transition-all duration-500 ${isOpen ? 'bg-[#E8730A] text-white rotate-180' : 'bg-orange-100 dark:bg-orange-950/40 text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 sm:px-8 pb-7">
          <p className="text-[#8B4513]/70 dark:text-orange-300/60 text-sm leading-relaxed font-normal max-w-2xl">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqsSection() {
  const [openId, setOpenId] = useState(1);

  return (
    <section className="py-24 bg-[#FFF8E7] dark:bg-[#0D0703] border-t border-orange-100/60 dark:border-orange-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8730A]/60 mb-4 block">Help & Support</span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A0E05] dark:text-orange-100 mb-4"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-[#E8730A]/30" />
            <span className="text-[#E8730A] text-sm">✦</span>
            <div className="h-px w-8 bg-[#E8730A]/30" />
          </div>
        </div>

        {/* FAQ List */}
        <div className="rounded-3xl overflow-hidden border border-orange-100 dark:border-orange-900/30 shadow-lg shadow-orange-100/50 dark:shadow-orange-950/20">
          {FAQS.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              toggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        {/* Bottom Contact CTA */}
        <div className="mt-12 p-7 rounded-3xl bg-gradient-to-r from-[#E8730A]/10 to-[#F2A52B]/10 border border-[#E8730A]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8730A] text-white flex items-center justify-center shadow-md shadow-orange-200">
              <HelpCircle size={22} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-[#1A0E05] dark:text-orange-100">Still have questions?</h4>
              <p className="text-xs text-[#8B4513]/60 dark:text-orange-400/50 font-medium mt-0.5">We're here 9 AM – 9 PM, 7 days a week</p>
            </div>
          </div>
          <button className="px-7 py-3 bg-[#E8730A] hover:bg-[#F2A52B] text-white text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
