'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ShoppingBag, Loader2, SearchX } from 'lucide-react';

function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
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

    const filteredProducts = query 
        ? products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.type.toLowerCase().includes(query.toLowerCase())
          )
        : products;

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-50 pb-10">
                    <div className="max-w-xl">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                            {query ? (
                                <>Search <span className="text-orange-600 italic font-medium">Results.</span></>
                            ) : (
                                <>Shop <span className="text-orange-600 italic font-medium">Authentic.</span></>
                            )}
                        </h1>
                        <p className="mt-4 text-gray-500 font-medium leading-relaxed">
                            {query ? (
                                <>Showing artisanal snacks matching <span className="font-bold text-gray-900 uppercase">"{query}"</span></>
                            ) : (
                                <>Discover our curated collection of artisanal snacks—where traditional Indian recipes meet modern gourmet standards.</>
                            )}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col animate-pulse rounded-2xl p-3 border border-gray-50">
                                <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4" />
                                <div className="space-y-2 px-1">
                                    <div className="h-3 w-16 bg-gray-50 rounded-full" />
                                    <div className="h-4 w-full bg-gray-50 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-32 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-8">
                                <SearchX size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {query ? "No items found" : "Coming Soon"}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto">
                                    {query ? "Try searching for a different keyword like 'Thekua' or 'Snack'." : "Our collection is currently being curated. Check back soon for fresh batches."}
                                </p>
                            </div>
                        )}
                    </>
                )}

            </main>

            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-orange-600" size={32} />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
