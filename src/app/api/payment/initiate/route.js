import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import razorpay from '@/lib/razorpay';

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        // Session is optional now to allow guest checkout

        const body = await req.json();
        await dbConnect();

        // 1. Create Order in Database
        const order = new Order({
            user: session?.user?.id || null, // Link to user if logged in, else null
            customerDetails: body.customerDetails,
            items: body.items,
            totalAmount: body.totalAmount,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Pending',
            status: 'Pending',
        });

        // 2. Create Razorpay Order
        const transactionId = `T${Date.now()}`;
        order.transactionId = transactionId;

        console.log('Creating Razorpay order for transaction:', transactionId);

        const amountInPaise = Math.round(Number(order.totalAmount) * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: transactionId,
            notes: {
                orderId: order._id.toString(),
                userId: session?.user?.id || 'guest',
            }
        });

        console.log('Razorpay Order Created:', razorpayOrder.id);

        // Store Razorpay order ID immediately so fallback verification can work
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        // 3. Return order details to frontend
        return NextResponse.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID,
            transactionId: transactionId,
            dbOrderId: order._id.toString(),
        });

    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
