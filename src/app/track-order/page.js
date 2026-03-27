'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, PackageCheck, Calendar, CreditCard, Copy, Check } from 'lucide-react';

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copiedField, setCopiedField] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const copyToClipboard = (text, field) => {
        if (!text) return;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(String(text))
                .then(() => {
                    setCopiedField(field);
                    setTimeout(() => setCopiedField(null), 2000);
                })
                .catch(err => console.error('Failed to copy text:', err));
        }
    };

    const fetchOrder = async (id) => {
        if (!id) return;
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const cleanId = id.trim().replace(/^#/, '');
            const res = await fetch(`/api/orders/${cleanId}`);
            const json = await res.json();

            if (json.success) {
                setOrder(json.data);
                setOrderId(id); // Keep the input in sync
            } else {
                setError('Order not found. Please check your Order ID.');
            }
        } catch (err) {
            console.error('Track order error:', err);
            setError('Failed to track order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            fetchOrder(id);
        }
    }, [searchParams]);

    const handleTrack = (e) => {
        e.preventDefault();
        if (orderId) {
            fetchOrder(orderId);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'Refund completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300';
            case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Order Confirmed': return 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400';
            case 'Processing': return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
            case 'Return/Replacement Initiated': return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
        }
    };

    const BASE_STEPS = ['Processing', 'Order Confirmed', 'Shipped', 'Delivered'];
    const RETURN_STEPS = ['Return/Replacement Initiated', 'Refund completed'];

    const STATUS_PRIORITY = {
        'Pending': 0,
        'Processing': 1,
        'Order Confirmed': 2,
        'Shipped': 3,
        'Delivered': 4,
        'Return/Replacement Initiated': 5,
        'Refund completed': 6
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto pt-24 pb-16 px-4 w-full">
                <div className="text-center mb-10">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Track Your Order</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium">
                        Enter your order ID below
                    </p>
                </div>

                <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-10">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 rounded-xl text-xs font-medium focus:border-black dark:focus:border-white transition-all outline-none h-11"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent animate-spin rounded-full"></div> : <Search size={16} />}
                            Track
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="max-w-xl mx-auto mb-8 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                        <p className="text-red-700 dark:text-red-400 text-xs font-semibold text-center">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <h1 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 dark:text-white tracking-tight font-mono break-all line-clamp-1 group flex items-center gap-2">
                                                #{String(order?._id || '').toUpperCase()}
                                                <button onClick={() => copyToClipboard(order?._id, 'order_id')} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors shrink-0">
                                                    {copiedField === 'order_id' ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400 opacity-0 group-hover:opacity-100" />}
                                                </button>
                                            </h1>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase border whitespace-nowrap shrink-0 ${getStatusStyle(order?.status)}`}>
                                                {order?.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                                            <Calendar size={12} /> {mounted && order?.createdAt ? `Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Loading date...'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full relative group">
                                <div className="w-full overflow-x-auto pb-4 mb-8 scrollbar-hide">
                                    <div className="min-w-[600px] sm:min-w-[800px] px-4">
                                        <div className="flex justify-between relative mb-4">
                                            {(() => {
                                                const currentStatus = order?.status || 'Pending';
                                                const isReturnMode = ['Return/Replacement Initiated', 'Refund completed'].includes(currentStatus);
                                                const visibleSteps = isReturnMode ? [...BASE_STEPS, ...RETURN_STEPS] : BASE_STEPS;

                                                return visibleSteps.map((step, idx, arr) => {
                                                    const currentPos = STATUS_PRIORITY[currentStatus] || 0;
                                                    const stepPos = STATUS_PRIORITY[step] || 0;
                                                    const isDone = stepPos <= currentPos;
                                                    const isActive = stepPos === currentPos;
                                                    const isCompleted = stepPos < currentPos;

                                                    const isCurrentLine = isActive && idx < arr.length - 1 && currentStatus !== 'Delivered' && currentStatus !== 'Refund completed' && currentStatus !== 'Cancelled';
                                                    const isUpcoming = !isDone && (idx > 0 && STATUS_PRIORITY[visibleSteps[idx - 1]] === currentPos);

                                                    return (
                                                        <div key={idx} className="flex flex-col items-center relative flex-1">
                                                            {/* Segmented Line */}
                                                            {idx < arr.length - 1 && (
                                                                <div className={`absolute top-4 left-1/2 w-full h-[2px] transition-all ${isCompleted ? 'bg-black dark:bg-white' :
                                                                    isCurrentLine ? 'animate-line-flow' : 'bg-gray-100 dark:bg-zinc-800'
                                                                    }`} />
                                                            )}

                                                            {/* Status Circle */}
                                                            <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black' :
                                                                'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-400'
                                                                } ${isActive ? 'ring-4 ring-black/5 dark:ring-white/5 scale-110 shadow-lg' : ''} ${(isActive || isUpcoming) && (currentStatus !== 'Delivered' && currentStatus !== 'Refund completed' && currentStatus !== 'Cancelled') ? 'animate-tracking-pulse' : ''
                                                                }`}>
                                                                {isDone ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                                            </div>
                                                            <span className={`mt-3 text-[8px] font-bold uppercase tracking-tighter text-center px-1 leading-tight ${isDone ? 'text-black dark:text-white' : 'text-gray-500'}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <MapPin size={12} /> Shipping to
                                    </h3>
                                    <div className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        <p className="font-bold text-gray-900 dark:text-white text-xs mb-1 uppercase">{order?.customerDetails?.name || 'Customer'}</p>
                                        <p>{order?.customerDetails?.address || 'Address N/A'}</p>
                                        <p>{order?.customerDetails?.city || ''}, {order?.customerDetails?.zip || ''}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CreditCard size={12} /> Summary
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-gray-500 font-medium">Items</span>
                                            <span className="text-gray-900 dark:text-white font-bold">{order?.items?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <span className="text-gray-900 dark:text-white font-bold uppercase">Total</span>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-black dark:text-white">₹{(order?.totalAmount || 0).toLocaleString()}</span>
                                                {order?.paymentMethod === 'COD' && (
                                                    <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-wider mt-0.5">Pay on Delivery</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {order?.trackingNumber && (
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg">
                                                <Truck size={18} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Tracking Information</p>
                                                <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase">{(order?.courierPartner || 'Courier')} Tracking</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">{order?.trackingNumber}</p>
                                            <button
                                                onClick={() => copyToClipboard(order?.trackingNumber, 'track_num')}
                                                className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all"
                                            >
                                                {copiedField === 'track_num' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <Package size={14} className="text-gray-400" />
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ordered Items</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {order?.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded-xl border border-dotted border-gray-200 dark:border-gray-800 flex-1 min-w-[140px]">
                                        <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800 flex-shrink-0">
                                            {item?.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                                        </div>
                                        <div className="min-w-0 pr-2">
                                            <p className="text-[10px] font-bold text-gray-900 dark:text-white truncate uppercase">{item?.name || 'Unknown Item'}</p>
                                            <p className="text-[9px] text-gray-400 font-medium">QTY: {item?.quantity || 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-black dark:border-white border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 animate-pulse">Loading Tracker</p>
                </div>
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
