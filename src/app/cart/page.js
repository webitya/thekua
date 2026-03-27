'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-24 pb-8 sm:pt-32 sm:pb-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12">Shopping Bag</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 font-light">Your shopping bag is currently empty.</p>
                        <Link href="/products" className="inline-block bg-black text-white px-10 py-3.5 rounded-xl hover:bg-gray-800 transition-all font-bold uppercase tracking-widest text-xs cursor-pointer">
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <section className="lg:col-span-8">
                            <ul className="space-y-6">
                                {cart.map((item, index) => (
                                    <li key={`${item._id}-${item.variant.name}-${index}`} className="group flex py-4 border-b border-gray-100 dark:border-zinc-900 last:border-0">
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg bg-gray-50 dark:bg-zinc-900 relative overflow-hidden shadow-sm">
                                                <Image
                                                    src={item.variant.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div className="ml-4 sm:ml-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white uppercase truncate">
                                                        <Link href={`/product/${item._id}`} className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer">
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="mt-1 text-xs text-gray-500 uppercase tracking-wider">{item.variant.name}</p>
                                                    <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">₹{item.price.toLocaleString()}</p>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                                    onClick={() => removeFromCart(item._id, item.variant.name)}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.variant.name, item.quantity - 1)}
                                                        className="p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <MinusIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.variant.name, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                                                    >
                                                        <PlusIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Order summary */}
                        <section className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                            <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Order Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Estimated Total</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    className="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-lg shadow-black/10 cursor-pointer"
                                    onClick={() => window.location.href = '/checkout'}
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest font-medium">
                                    Tax included • Free shipping on all orders
                                </p>
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
