'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();
    const [status, setStatus] = useState('loading');
    const [retryCount, setRetryCount] = useState(0);
    const [orderData, setOrderData] = useState(null);
    const [copied, setCopied] = useState(false);
    const transactionId = searchParams.get('id');

    useEffect(() => {
        if (!transactionId) {
            router.push('/');
            return;
        }

        const MAX_RETRIES = 20;
        let isStopped = false;

        const checkStatus = async (currentRetry) => {
            if (isStopped) return;

            if (currentRetry >= MAX_RETRIES) {
                setStatus('timeout');
                return;
            }

            try {
                const res = await fetch(`/api/payment/status/${transactionId}`);
                const data = await res.json();

                if (isStopped) return;

                if (data.success) {
                    if (data.status === 'Completed') {
                        setOrderData(data);
                        setStatus('success');
                        clearCart();
                        isStopped = true;
                    } else if (data.status === 'Failed') {
                        setStatus('failed');
                        isStopped = true;
                    } else {
                        // Still pending, poll again
                        const delay = currentRetry < 5 ? 1500 : 3000;
                        setRetryCount(currentRetry + 1);
                        setTimeout(() => checkStatus(currentRetry + 1), delay);
                    }
                } else {
                    // Treat API failure as a retry
                    const delay = currentRetry < 5 ? 1500 : 3000;
                    setRetryCount(currentRetry + 1);
                    setTimeout(() => checkStatus(currentRetry + 1), delay);
                }
            } catch (error) {
                console.error('Status check error:', error);
                const delay = currentRetry < 5 ? 1500 : 3000;
                setRetryCount(currentRetry + 1);
                setTimeout(() => checkStatus(currentRetry + 1), delay);
            }
        };

        checkStatus(0);

        return () => {
            isStopped = true;
        };
    }, [transactionId, clearCart, router]);

    return (
        <div className="max-w-3xl mx-auto py-32 px-4 text-center">
            {status === 'loading' && (
                <div className="space-y-6">
                    <ArrowPathIcon className="h-20 w-20 text-black dark:text-white mx-auto animate-spin" />
                    <h1 className="text-3xl font-bold uppercase tracking-widest">Verifying Payment</h1>
                    <p className="text-gray-500 font-light italic">
                        Processing your transaction, please do not refresh...
                        {retryCount > 0 && <span className="block mt-2 text-[10px] opacity-50 uppercase tracking-tighter">Attempt {retryCount}/20</span>}
                    </p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="relative inline-block">
                        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping -z-10"></div>
                    </div>
                    <h1 className="text-4xl font-bold uppercase tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-500 font-light max-w-md mx-auto text-lg">
                        Thank you for choosing <span className="font-bold text-black dark:text-white">AREUM</span>.
                        Your aesthetic journey begins now. We'll notify you when your order is out for delivery.
                    </p>
                    {orderData && (
                        <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 max-w-sm mx-auto border border-gray-100 dark:border-zinc-800 space-y-4 shadow-sm">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <code className="text-sm font-mono font-bold text-black dark:text-white bg-white dark:bg-black px-3 py-1 rounded border border-gray-200 dark:border-zinc-700">
                                        {orderData.orderId}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(orderData.orderId);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                        title="Copy Order ID"
                                    >
                                        {copied ? (
                                            <span className="text-[10px] font-bold text-green-600 uppercase">Copied!</span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.522 2.25h-3.044a2.25 2.25 0 0 0-2.144 1.638L7.12 6.112H4.5A2.25 2.25 0 0 0 2.25 8.362v11.25A2.25 2.25 0 0 0 4.5 21.872H16.5a2.25 2.25 0 0 0 2.25-2.25V8.362a2.25 2.25 0 0 0-2.25-2.25h-2.621l-1.963-2.224Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.125h-3L4.5 9.75M13.5 13.5h-3L4.5 13.125M13.5 16.875h-3L4.5 16.5" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-400 italic">Save this ID to track your order anonymously on our website.</p>
                        </div>
                    )}
                    <div className="pt-8 space-x-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => router.push(orderData ? `/track-order?id=${orderData.orderId}` : '/orders')}
                            className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all text-xs shadow-lg shadow-black/10"
                        >
                            Track Order
                        </button>
                        <button
                            onClick={() => router.push('/products')}
                            className="w-full sm:w-auto border border-zinc-200 dark:border-zinc-800 px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-xs"
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            )}

            {status === 'failed' && (
                <div className="space-y-6 animate-fade-in">
                    <XCircleIcon className="h-20 w-20 text-red-500 mx-auto" />
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-red-600">Payment FAILED</h1>
                    <p className="text-gray-500 font-light max-w-md mx-auto">
                        We couldn't verify your payment. If the amount was deducted, it will be refunded automatically by your bank within 5-7 business days.
                    </p>
                    <div className="pt-8">
                        <button
                            onClick={() => router.push('/checkout')}
                            className="bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all text-xs"
                        >
                            Return to Checkout
                        </button>
                    </div>
                </div>
            )}

            {status === 'timeout' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="h-24 w-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <ArrowPathIcon className="h-12 w-12 text-yellow-600 animate-spin" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest">Verification Pending</h1>
                    <p className="text-gray-500 font-light max-w-md mx-auto">
                        Your payment verification is taking longer than expected. Don't worry, your order will be confirmed automatically once the bank approves the transaction.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => router.push('/orders')}
                            className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all text-xs shadow-lg shadow-black/10"
                        >
                            Check Order History
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto border border-zinc-200 dark:border-zinc-800 px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-xs"
                        >
                            Refresh Status
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />
            <Suspense fallback={
                <div className="max-w-3xl mx-auto py-32 px-4 text-center">
                    <ArrowPathIcon className="h-20 w-20 text-black dark:text-white mx-auto animate-spin" />
                </div>
            }>
                <PaymentStatusContent />
            </Suspense>
            <Footer />
        </div>
    );
}
