import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import User from '../../../../models/User';
import Product from '../../../../models/Product';

export async function GET(req) {
    try {
        await dbConnect();

        // Fetch counts and revenue
        const [totalUsers, totalOrders, orders, productCount] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Order.countDocuments({}),
            Order.find({ status: { $ne: 'Cancelled' } }),
            Product.countDocuments({}),
        ]);

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        const confirmedRevenue = orders
            .filter(order => order.status === 'Delivered')
            .reduce((acc, order) => acc + order.totalAmount, 0);

        const pendingRevenue = orders
            .filter(order => ['Pending', 'Processing', 'Shipped'].includes(order.status))
            .reduce((acc, order) => acc + order.totalAmount, 0);

        // Get recent orders
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                totalRevenue,
                confirmedRevenue,
                pendingRevenue,
                productCount,
            },
            recentOrders,
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
