'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

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
        <div className="group relative flex flex-col bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-[2.5rem] p-4 transition-all duration-700 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            {/* Image Section */}
            <Link
                href={`/product/${product._id}`}
                className="block relative w-full aspect-[3/4] bg-gray-50 dark:bg-zinc-900 rounded-[2rem] overflow-hidden mb-6 shadow-sm transition-all duration-700 ease-in-out"
            >
                <Image
                    src={selectedVariant.image}
                    alt={`${product.name} - ${selectedVariant.name}`}
                    fill
                    className="object-cover object-center transition-opacity duration-1000 ease-out"
                    priority
                />

                {/* Subtle Glass Overlay on Hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 dark:group-hover:bg-black/5 transition-all duration-500" />

                {/* New/Best Seller Tag placeholder - can be dynamic if data exists */}
                {product.isNew && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                        New
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="space-y-5 px-2 pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">{product.type}</p>
                        <Link href={`/product/${product._id}`}>
                            <h3 className="text-sm sm:text-lg font-black text-black dark:text-white uppercase tracking-tighter hover:text-gray-600 dark:hover:text-gray-300 transition-colors line-clamp-1 leading-none">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    <div className="text-right">
                        <p className="text-sm sm:text-lg font-black text-black dark:text-white tracking-tighter transition-transform group-hover:scale-110 origin-right">
                            ₹{product.price.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Color Swatches & Add to Bag Row */}
                <div className="flex items-center justify-between gap-4 pt-1">
                    {/* Color Swatches */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="flex items-center gap-2.5">
                            {product.variants.map((variant) => (
                                <button
                                    key={`${product._id}-${variant.name}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedVariant(variant);
                                    }}
                                    className={`w-5 h-5 rounded-full border-2 transition-all duration-500 relative cursor-pointer ring-offset-2 dark:ring-offset-zinc-950 ${selectedVariant.name === variant.name
                                        ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 scale-125 z-10'
                                        : 'border-transparent hover:scale-125 opacity-60 hover:opacity-100'
                                        }`}
                                    title={variant.name}
                                    aria-label={`Select ${variant.name}`}
                                >
                                    <span
                                        className="absolute inset-[1.5px] rounded-full shadow-inner shadow-black/5"
                                        style={{ backgroundColor: variant.hex }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Compact Premium Button */}
                    <button
                        onClick={handleBuyNow}
                        className="flex-grow sm:flex-grow-0 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.2em] px-7 py-3 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/5 dark:shadow-white/5"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}



