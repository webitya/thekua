'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
    const { user, status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white luxury-text mb-8">My Account</h1>
                <div className="bg-gray-50 dark:bg-zinc-900 overflow-hidden shadow rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Profile Information</h3>
                        <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-5">
                            <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 font-bold uppercase">{user.name}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user.email}</dd>
                                </div>
                                {user.phone && (
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user.phone}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
