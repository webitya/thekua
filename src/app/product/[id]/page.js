'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ProductPage({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products`);
                const json = await res.json();
                if (json.success) {
                    const found = json.data.find(p => p._id === id);
                    if (found) {
                        setProduct(found);
                        setSelectedColor(found.variants[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-black min-h-screen flex flex-col">
                <Navbar />
                <main className="min-h-screen flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
                    <div className="lg:grid lg:grid-cols-[45%_1fr] lg:gap-x-16 lg:items-start w-full animate-pulse">
                        <div className="flex flex-col">
                            <div className="w-full aspect-square bg-gray-100 dark:bg-zinc-900 rounded-[2.5rem]" />
                            <div className="mt-6 grid grid-cols-5 gap-3 px-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-zinc-900" />
                                ))}
                            </div>
                        </div>
                        <div className="mt-12 lg:mt-0 flex flex-col bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-[2.5rem] p-6 sm:p-10">
                            <div className="space-y-4 mb-8">
                                <div className="h-2 w-24 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                <div className="h-10 w-3/4 bg-gray-100 dark:bg-zinc-900 rounded-xl" />
                            </div>
                            <div className="flex items-center justify-between border-y border-gray-50 dark:border-zinc-900 py-6 mb-8">
                                <div className="h-8 w-32 bg-gray-100 dark:bg-zinc-900 rounded-lg" />
                                <div className="h-6 w-24 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="h-2 w-20 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                    <div className="flex gap-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-900" />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-20 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                    <div className="h-20 w-full bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
                                </div>
                                <div className="pt-6">
                                    <div className="h-14 w-full bg-gray-100 dark:bg-zinc-900 rounded-[1.5rem]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }



    if (!product) {
        return notFound();
    }

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />

            <main className="min-h-screen flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
                <div className="lg:grid lg:grid-cols-[45%_1fr] lg:gap-x-16 lg:items-start w-full">
                    {/* Image gallery */}
                    <div className="flex flex-col sticky top-32">
                        <div className="w-full aspect-square bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-gray-100 dark:border-zinc-800">
                            <Image
                                src={selectedColor?.image || product.variants[0].image}
                                alt={product.name}
                                fill
                                className="w-full h-full object-center object-cover transition-all duration-700 ease-in-out"
                                priority
                            />
                        </div>
                        {/* Thumbnail/Variant Preview */}
                        <div className="mt-6 grid grid-cols-5 gap-3 px-2">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.name}
                                    onClick={() => setSelectedColor(variant)}
                                    className={classNames(
                                        'relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer',
                                        selectedColor?.name === variant.name
                                            ? 'border-black dark:border-white ring-4 ring-black/5'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    )}
                                >
                                    <Image src={variant.image} alt={variant.name} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product info - Outlined Container */}
                    <div className="mt-12 lg:mt-0 flex flex-col bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-[2.5rem] p-6 sm:p-10 shadow-sm transition-all duration-500">
                        <div className="space-y-2 mb-8">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gray-400">{product.type}</p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">{product.name}</h1>
                        </div>

                        <div className="flex items-center justify-between border-y border-gray-50 dark:border-zinc-900 py-6 mb-8">
                            <p className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tighter">₹{product.price.toLocaleString()}</p>
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-zinc-900 px-3 py-1.5 rounded-full">
                                <span className={classNames(
                                    'h-2 w-2 rounded-full animate-pulse',
                                    product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                                )}></span>
                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest leading-none">
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Shade Selection */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        Selected Shade: <span className="text-black dark:text-white font-black ml-2">{selectedColor?.name}</span>
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.name}
                                            onClick={() => setSelectedColor(variant)}
                                            className={classNames(
                                                selectedColor?.name === variant.name
                                                    ? 'ring-2 ring-offset-2 ring-black dark:ring-white z-10'
                                                    : 'opacity-70 hover:opacity-100',
                                                'relative h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300'
                                            )}
                                            title={variant.name}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="h-full w-full rounded-full border border-black/5 shadow-inner"
                                                style={{ backgroundColor: variant.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Description</h3>
                                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-zinc-900">
                                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Infused With</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.features.map((feature) => (
                                            <div key={feature} className="flex items-center space-x-3 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 group hover:border-gray-200 dark:hover:border-zinc-700 transition-colors">
                                                <span className="h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/20 group-hover:bg-black dark:group-hover:bg-white transition-colors"></span>
                                                <span className="font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-6">
                                <button
                                    type="button"
                                    disabled={product.stock === 0}
                                    className="w-full bg-black dark:bg-white dark:text-black text-white py-4 sm:py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-gray-100 dark:disabled:bg-zinc-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/5 active:scale-[0.98] flex items-center justify-center cursor-pointer"
                                    onClick={() => {
                                        addToCart(product, selectedColor || product.variants[0]);
                                    }}
                                >
                                    {product.stock > 0 ? 'Add to bag' : 'Sold Out'}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">Complimentary shipping on orders over ₹1,000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            <Footer />
        </div>
    );
}
