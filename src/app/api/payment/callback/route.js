import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req) {
    try {
        const body = await req.json();

        console.log('Razorpay Payment Verification:', body);

        // 1. Verify Razorpay Signature
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            console.error('Invalid Razorpay signature');
            return NextResponse.json(
                { success: false, message: 'Invalid signature' },
                { status: 400 }
            );
        }

        console.log('Razorpay signature verified successfully');

        // 2. Update Order in Database
        await dbConnect();
        const order = await Order.findOne({ transactionId: body.receipt || body.transactionId });

        if (!order) {
            console.error('Order not found');
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // 3. Update Order Status
        // Assuming razorpayOrder.status would be available if we fetched the order from Razorpay API
        // For now, we'll directly update based on successful signature verification
        order.paymentStatus = 'Completed';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
        order.status = 'Order Confirmed'; // Move to confirmed status once paid

        await order.save();

        console.log('Order updated successfully:', order.transactionId);

        // 4. Send confirmation email
        try {
            const { sendOrderConfirmationEmail } = await import('@/lib/email');
            await sendOrderConfirmationEmail(order);
        } catch (emailError) {
            console.error('Failed to send payment confirmation email:', emailError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Razorpay Verification Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
