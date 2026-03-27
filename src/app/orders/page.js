'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Calendar, Package, Copy, Check } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [mounted, setMounted] = useState(false);
    const { user, status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const json = await res.json();
                if (json.success) {
                    setOrders(Array.isArray(json.data) ? json.data : []);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const handleCopy = (e, text, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(String(text))
                .then(() => {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                })
                .catch(err => console.error('Failed to copy text:', err));
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent"></div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'Refund completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400';
            case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Order Confirmed': return 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400';
            case 'Processing': return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
            case 'Return/Replacement Initiated': return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto pt-24 pb-16 px-4 w-full">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Purchase History</h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-medium tracking-wider">Manage your recent orders</p>
                    </div>
                </div>

                {(!orders || orders.length === 0) ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <ShoppingBag size={40} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">Your order history is empty.</p>
                        <Link href="/products" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link
                                href={`/orders/${order?._id}`}
                                key={order?._id}
                                className="block bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all group overflow-hidden shadow-sm hover:shadow-md"
                            >
                                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-11 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden flex-shrink-0 relative">
                                            {order?.items?.[0]?.image ? (
                                                <img src={order.items[0].image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-300"><Package size={16} /></div>
                                            )}
                                            {order?.items?.length > 1 && (
                                                <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[8px] px-1 font-bold rounded-tl-md">+{order.items.length - 1}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <button
                                                    onClick={(e) => handleCopy(e, order?._id, order?._id)}
                                                    className="text-sm font-bold text-gray-900 dark:text-white font-mono hover:text-blue-600 transition-colors flex items-center gap-1.5 group/id"
                                                >
                                                    #{String(order?._id || '').slice(-8).toUpperCase()}
                                                    {copiedId === order?._id ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-gray-400 opacity-0 group-hover/id:opacity-100 transition-opacity" />}
                                                </button>
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${getStatusStyle(order?.status)}`}>
                                                    {order?.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {mounted && order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>{order?.items?.length || 0} {(order?.items?.length === 1) ? 'Item' : 'Items'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right border-t sm:border-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total</p>
                                            <p className="text-base font-bold text-gray-900 dark:text-white">₹{(order?.totalAmount || 0).toLocaleString()}</p>
                                            {order?.paymentMethod === 'COD' && (
                                                <p className="text-[8px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-tighter mt-0.5">Pay on Delivery</p>
                                            )}
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
