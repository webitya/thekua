import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isAdmin } from '@/lib/admin-auth';

export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const adminAllowed = await isAdmin();

        // If not admin AND not logged in as user, they shouldn't see anything here
        if (!adminAllowed && !session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Admins see all orders, users see only theirs
        const query = adminAllowed ? {} : { "customerDetails.email": session.user.email };
        const orders = await Order.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const session = await getServerSession(authOptions);

        // Add user reference if logged in
        if (session && session.user) {
            body.user = session.user.id;
        }

        // Generate transactionId for COD orders if not present
        if (body.paymentMethod === 'COD' && !body.transactionId) {
            body.transactionId = `COD-${Date.now()}-${Math.random().toString(36).slice(-4).toUpperCase()}`;
        }

        // Set default status to Processing for all new orders to align with timeline
        body.status = 'Processing';
        const order = await Order.create(body);

        // Send confirmation email
        try {
            const { sendOrderConfirmationEmail } = await import('@/lib/email');
            await sendOrderConfirmationEmail(order);
        } catch (emailError) {
            console.error('Failed to send COD confirmation email:', emailError);
        }

        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error) {
        console.error('Order Creation Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
