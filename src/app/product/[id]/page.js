'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { 
    Leaf, 
    Clock, 
    ShieldCheck, 
    Info, 
    ChevronLeft, 
    ChevronRight, 
    ShoppingBag,
    Scale,
    Calendar,
    ListChecks
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
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
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImage, setActiveImage] = useState('');
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products`);
                const json = await res.json();
                if (json.success) {
                    const found = json.data.find(p => p._id === id);
                    if (found) {
                        setProduct(found);
                        setSelectedVariant(found.variants[0]);
                        setActiveImage(found.variants[0].images[0] || found.images[0] || '');
                        // Combine variant images and gallery images
                        const allImgs = [
                            ...found.variants.flatMap(v => v.images || []),
                            ...(found.images || [])
                        ].filter((v, i, a) => v && a.indexOf(v) === i); // Unique & valid images
                        setGallery(allImgs);
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
            <div className="bg-white min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 w-full animate-pulse">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                        <div className="aspect-square bg-gray-50 rounded-3xl" />
                        <div className="space-y-6 mt-10 lg:mt-0">
                            <div className="h-4 w-24 bg-gray-50 mb-4" />
                            <div className="h-10 w-3/4 bg-gray-50 mb-6" />
                            <div className="h-20 w-full bg-gray-50" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) return notFound();

    return (
        <div className="bg-white min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb / Category */}
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 border-b border-gray-50 pb-2">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-black transition-colors">Catalogue</Link>
                        <span>/</span>
                        <span className="text-orange-600">{product.type}</span>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 items-start">
                        
                        {/* LEFT: Cinematic Gallery */}
                        <div className="lg:col-span-6 space-y-4">
                            <div className="relative aspect-square bg-white border border-gray-100 rounded-[2rem] overflow-hidden group shadow-sm">
                                <Image
                                    src={activeImage || (selectedVariant && selectedVariant.images && selectedVariant.images[0]) || '/placeholder.png'}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                    priority
                                />
                                {/* Veg Badge */}
                                <div className="absolute top-6 left-6 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-xl">
                                    <div className={classNames(
                                        "h-3 w-3 rounded-full flex items-center justify-center p-0.5",
                                        product.isVeg ? "border-2 border-green-600" : "border-2 border-red-600"
                                    )}>
                                        <div className={classNames(
                                            "h-full w-full rounded-full",
                                            product.isVeg ? "bg-green-600" : "bg-red-600"
                                        )} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                                        {product.isVeg ? '100% PURE VEG' : 'CONTAINS EGG'}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail Grid */}
                            <div className="flex space-x-2 overflow-x-auto pb-2 px-1 custom-scrollbar">
                                {gallery.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={classNames(
                                            "relative h-14 w-14 lg:h-16 lg:w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                                            activeImage === img ? "border-orange-600 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Transactional Info */}
                        <div className="lg:col-span-6 mt-4 lg:mt-0 lg:sticky lg:top-24 space-y-3">
                            
                            {/* Header & Pricing */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50/50 px-2 py-0.5 rounded-full inline-block">
                                    {product.type}
                                </span>
                                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 leading-none uppercase underline decoration-orange-100 decoration-2 underline-offset-2">
                                    {product.name}
                                </h1>
                                <div className="pt-1 flex items-baseline space-x-3">
                                    {selectedVariant?.discountPrice ? (
                                        <>
                                            <span className="text-2xl font-bold tracking-tight text-orange-600">₹{selectedVariant.discountPrice}</span>
                                            <span className="text-base font-medium tracking-tight text-gray-300 line-through">₹{selectedVariant.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-bold tracking-tight text-gray-900">₹{selectedVariant?.price || product.variants[0].price}</span>
                                    )}
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">Incl. of tax</span>
                                </div>
                            </div>

                            {/* Quick Specs - Grid Style */}
                            <div className="grid grid-cols-2 gap-4 border-y border-gray-50 py-2">
                                <div className="flex items-center space-x-2.5 group">
                                    <div className="h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                        <Scale size={14} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Weight</p>
                                        <p className="text-[10px] font-bold text-gray-900 uppercase">{selectedVariant?.weight || product.variants[0].weight}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2.5 group">
                                    <div className="h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                        <Calendar size={14} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Shelf Life</p>
                                        <p className="text-[10px] font-bold text-gray-900 uppercase">{product.shelfLife}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pack Size Selection */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select Pack Size</h3>
                                    <span className="text-[8px] font-medium text-gray-300 italic uppercase">Purely Handcrafted</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.name}
                                            onClick={() => {
                                                setSelectedVariant(v);
                                                setActiveImage(v.images?.[0] || '');
                                            }}
                                            className={classNames(
                                                "relative p-4 text-left border transition-all cursor-pointer",
                                                selectedVariant?.name === v.name
                                                    ? "border-orange-600 bg-orange-50/20 ring-4 ring-orange-50/50"
                                                    : "border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <p className={classNames(
                                                "text-[10px] font-bold uppercase tracking-widest leading-none mb-1",
                                                selectedVariant?.name === v.name ? "text-orange-600" : "text-gray-900"
                                            )}>{v.name}</p>
                                            <p className="text-[9px] font-medium text-gray-400 uppercase">{v.weight}</p>
                                            {selectedVariant?.name === v.name && (
                                                <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-orange-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description & Ingredients */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">The Tradition</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        {product.description}
                                    </p>
                                </div>

                                {product.ingredients && product.ingredients.length > 0 && (
                                    <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-2">
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <ListChecks size={12} />
                                            <h3 className="text-[9px] font-bold uppercase tracking-widest">Core Ingredients</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {product.ingredients.map((ing, i) => (
                                                <span key={i} className="text-[8px] font-bold bg-white text-gray-700 px-2 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Allergen Info */}
                            <div className="flex items-start space-x-3 p-4 bg-orange-50/30 border border-orange-100/50 rounded-2xl">
                                <Info size={16} className="text-orange-400 mt-0.5 shrink-0" />
                                <div className="text-[10px] font-medium text-orange-900 leading-relaxed">
                                    <span className="font-black uppercase tracking-widest text-[9px] block mb-1">Dietary Information</span>
                                    {product.allergenInfo}
                                </div>
                            </div>

                            {/* Add to Cart CTA */}
                            <div className="pt-0.5">
                                <button
                                    type="button"
                                    className="w-full bg-black text-white py-3.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center cursor-pointer space-x-3"
                                    onClick={() => addToCart(product, selectedVariant || product.variants[0])}
                                >
                                    <ShoppingBag size={14} strokeWidth={2.5} />
                                    <span>Add to bag</span>
                                </button>
                                <p className="text-center text-[7px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-3 flex items-center justify-center space-x-1">
                                    <ShieldCheck size={9} className="text-orange-500" />
                                    <span>Quality Handcrafted Product</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
