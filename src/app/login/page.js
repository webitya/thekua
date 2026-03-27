'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    const { user, isAuthenticated, status, login, socialLogin } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (status === 'authenticated' || isAuthenticated) {
            router.replace('/');
        }
    }, [status, isAuthenticated, router]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register State
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login(loginEmail, loginPassword);
            if (result?.error) {
                setError(result.error);
            } else {
                router.replace('/');
                router.refresh();
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterStep1 = (e) => {
        e.preventDefault();
        // Simulate sending OTP
        setOtpSent(true);
        // In a real production app, you'd call an API here to send a real SMS/Email OTP
        console.log(`OTP for ${registerData.phone}: 1234`);
    };

    const handleRegisterStep2 = async (e) => {
        e.preventDefault();
        if (otp !== '1234') {
            setError('Invalid OTP. Please try 1234.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });

            const data = await res.json();

            if (res.ok) {
                // Auto login after registration
                const result = await login(registerData.email, registerData.password);
                if (result?.error) {
                    setError('Account created but login failed. Please sign in manually.');
                } else {
                    router.replace('/');
                    router.refresh();
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong during registration.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setError('');
        try {
            await socialLogin(provider);
        } catch (err) {
            setError(`Failed to sign in with ${provider}`);
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
                {(status === 'loading' || status === 'authenticated') ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
                        <p className="text-gray-500 uppercase tracking-widest text-xs animate-pulse">
                            {status === 'authenticated' ? 'Redirecting...' : 'Verifying Session...'}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-md w-full space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                className={`flex-1 py-4 text-center text-sm font-medium uppercase tracking-widest ${activeTab === 'login' ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                onClick={() => setActiveTab('login')}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 py-4 text-center text-sm font-medium uppercase tracking-widest ${activeTab === 'register' ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                onClick={() => setActiveTab('register')}
                            >
                                Create Account
                            </button>
                        </div>

                        <div className="mt-8">
                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    onClick={() => handleSocialLogin('Google')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                                >
                                    <span className="sr-only">Sign in with Google</span>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>

                                <button
                                    onClick={() => handleSocialLogin('Facebook')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                                >
                                    <span className="sr-only">Sign in with Facebook</span>
                                    <svg className="w-5 h-5 text-[#1877F2]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-black text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {activeTab === 'login' ? (
                                <form className="space-y-6" onSubmit={handleLogin}>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer uppercase tracking-widest">
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form className="space-y-6" onSubmit={otpSent ? handleRegisterStep2 : handleRegisterStep1}>
                                    {!otpSent ? (
                                        <>
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                                    value={registerData.name}
                                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                                                <input
                                                    id="reg-email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                                    value={registerData.email}
                                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                                    value={registerData.phone}
                                                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Set Password</label>
                                                <input
                                                    id="reg-password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                                    value={registerData.password}
                                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer uppercase tracking-widest">
                                                    Get OTP
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-center mb-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Enter the OTP sent to {registerData.phone}</p>
                                            </div>
                                            <div>
                                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">OTP Code</label>
                                                <input
                                                    id="otp"
                                                    name="otp"
                                                    type="text"
                                                    required
                                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-center tracking-widest text-xl"
                                                    placeholder="1234"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer uppercase tracking-widest">
                                                    Verify & Create Account
                                                </button>
                                            </div>
                                            <div className="text-center mt-2">
                                                <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white underline cursor-pointer">
                                                    Change Details
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
