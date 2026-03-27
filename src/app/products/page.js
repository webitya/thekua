'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const json = await res.json();
                if (json.success) {
                    setProducts(json.data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-4">
                        The Luxe <span className="italic font-light text-gray-400">Archive</span>
                    </h1>
                    <div className="w-8 h-1 bg-black dark:bg-white mx-auto mb-5 rounded-full opacity-10"></div>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                        Discover our curated collection of luxury essentials—where Korean-inspired beauty meets modern sophistication.
                    </p>
                </div>

                {loading ? (
                    <div className="pt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col animate-pulse border border-gray-200 dark:border-zinc-800 rounded-[2.5rem] p-4">
                                <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-zinc-900 rounded-[2rem] mb-6" />
                                <div className="space-y-5 px-2">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 w-2/3">
                                            <div className="h-2 w-16 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                            <div className="h-5 w-full bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                        </div>
                                        <div className="h-5 w-12 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <div className="flex gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-900" />
                                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-900" />
                                        </div>
                                        <div className="h-10 w-28 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="pt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-xl font-medium text-gray-500">Our collection is currently being curated. Check back soon.</p>
                            </div>
                        )}
                    </>
                )}

            </main>

            <Footer />
        </div>
    );
}
