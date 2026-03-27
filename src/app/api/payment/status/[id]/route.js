import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import razorpay from '@/lib/razorpay';

export async function GET(req, { params }) {
    const paramsData = await params;
    const { id: transactionId } = paramsData;

    try {
        await dbConnect();
        const order = await Order.findOne({ transactionId });

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // If payment is still pending and we have a razorpay order ID, try to fetch the latest status
        if (order.paymentStatus === 'Pending' && order.razorpayOrderId) {
            try {
                const razorpayOrder = await razorpay.orders.fetch(order.razorpayOrderId);

                // If Razorpay shows the order as paid, update our database
                if (razorpayOrder.status === 'paid') {
                    order.paymentStatus = 'Completed';
                    order.status = 'Order Confirmed'; // Move to confirmed status once paid
                    await order.save();
                    console.log('Auto-verified payment for order:', transactionId);

                    // Send confirmation email
                    try {
                        const { sendOrderConfirmationEmail } = await import('@/lib/email');
                        await sendOrderConfirmationEmail(order);
                    } catch (emailError) {
                        console.error('Failed to send auto-verification email:', emailError);
                    }
                }
            } catch (razorpayError) {
                console.error('Error fetching Razorpay order status:', razorpayError);
                // Continue with database status even if Razorpay fetch fails
            }
        }

        // Return the current payment status from database
        return new Response(JSON.stringify({
            success: true,
            status: order.paymentStatus,
            orderId: order._id.toString(),
            transactionId: order.transactionId,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            orderStatus: order.status
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });

    } catch (error) {
        console.error('Payment Status Check Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
