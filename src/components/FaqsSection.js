'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    id: 1,
    question: "How long does shipping typically take?",
    answer: "Orders are processed within 24-48 hours. Domestic shipping within India usually takes 3-5 business days. We use secure, food-grade packaging."
  },
  {
    id: 2,
    question: "Are your snacks made fresh and preservative-free?",
    answer: "Yes! Our products are handcrafted in small batches using traditional recipes and only natural ingredients. We never use artificial preservatives."
  },
  {
    id: 3,
    question: "What is your return policy?",
    answer: "Since our snacks are edible goods, we do not accept returns. If your order arrives damaged, contact us within 48 hours for a replacement."
  },
  {
    id: 4,
    question: "Do you ship pan-India?",
    answer: "Yes, we deliver to all major cities and towns across India. Free shipping is available on orders above ₹499."
  }
];

function FaqItem({ faq, isOpen, toggle }) {
  return (
    <div className={`border-b border-gray-100 transition-all duration-300 ${isOpen ? 'bg-gray-50/30' : ''}`}>
      <button
        onClick={toggle}
        className="w-full py-5 px-6 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-300 pr-4 ${isOpen ? 'text-orange-600' : 'text-gray-900 group-hover:text-orange-600'}`}>
          {faq.question}
        </span>
        <div className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-300 ${isOpen ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6">
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
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
    <section className="py-16 bg-white border-t border-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Got questions? <br /> We've got <span className="text-orange-600 italic font-medium">Answers.</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
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
        <div className="mt-8 p-6 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold">Need more help?</h4>
              <p className="text-[10px] text-gray-400 font-medium">Our support team is active 24/7.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2">
            Contact Support
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
