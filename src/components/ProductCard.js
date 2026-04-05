'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, selectedVariant);
        router.push('/checkout');
    };

    return (
        <div className="group relative flex flex-col bg-white border border-gray-100 rounded-[2rem] p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-100/50">
            {/* Image Section */}
            <Link
                href={`/product/${product._id}`}
                className="block relative w-full aspect-square bg-gray-50 rounded-[1.5rem] overflow-hidden mb-5 group-hover:scale-[0.98] transition-transform duration-500"
            >
                <Image
                    src={(selectedVariant.images && selectedVariant.images[0]) || (product.variants[0].images && product.variants[0].images[0]) || '/placeholder.png'}
                    alt={`${product.name} - ${selectedVariant.name}`}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    priority
                />
                
                {/* Variant Swipe Overlay - Shows Pack Sizes */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/40 to-transparent flex justify-center gap-2">
                  {product.variants.map((v) => (
                    <button 
                      key={v.name}
                      onClick={(e) => { e.preventDefault(); setSelectedVariant(v); }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${selectedVariant.name === v.name ? 'bg-white w-4' : 'bg-white/60 hover:bg-white'}`}
                      title={v.weight}
                    />
                  ))}
                </div>
            </Link>

            {/* Content Section */}
            <div className="space-y-4 px-2 pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <Link href={`/product/${product._id}`}>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 uppercase tracking-tight">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                            <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-widest">{product.type}</p>
                            <span className="h-1 w-1 rounded-full bg-gray-200" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedVariant.weight}</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        {selectedVariant.discountPrice ? (
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-black text-orange-600 tracking-tighter leading-none">₹{selectedVariant.discountPrice}</span>
                                <span className="text-[10px] font-bold text-gray-300 line-through tracking-tighter">₹{selectedVariant.price}</span>
                            </div>
                        ) : (
                            <p className="text-lg font-black text-gray-900 tracking-tighter leading-none">
                                ₹{selectedVariant.price.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Features Tag */}
                <div className="flex flex-wrap gap-2">
                  {product.features?.slice(0, 2).map((f) => (
                    <span key={f} className="text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] py-3.5 rounded-xl hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={() => addToCart(product, selectedVariant)}
                        className="p-3.5 bg-gray-50 text-gray-900 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}



