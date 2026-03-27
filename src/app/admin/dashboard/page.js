'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users as UsersIcon,
    ShoppingBag,
    Package,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    const { stats, recentOrders } = data || {
        stats: { totalRevenue: 0, confirmedRevenue: 0, pendingRevenue: 0, totalUsers: 0, totalOrders: 0, productCount: 0 },
        recentOrders: []
    };

    const cards = [
        {
            name: 'Confirmed Revenue',
            value: `₹${stats.confirmedRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            name: 'Pending Revenue',
            value: `₹${stats.pendingRevenue.toLocaleString()}`,
            icon: TrendingUp, // Using same icon or maybe 'Clock' if available, but TrendingUp is fine for revenue
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        {
            name: 'Registered Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            name: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            name: 'Total Products',
            value: stats.productCount,
            icon: Package,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.name} className="bg-white p-6 rounded-none shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-none ${card.bg} ${card.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm font-semibold text-black hover:underline flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {order.customerDetails.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-none 
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
                                            No orders found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
