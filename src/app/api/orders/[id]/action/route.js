import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const adminAllowed = await isAdmin();

        const paramsData = await params;
        const { id } = paramsData;
        const { action } = await req.json();

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // Permission check:
        // 1. Admin - always allowed
        // 2. Logged in Owner - ID or Email matches
        // 3. Guest - Allowed if it's a guest order (no user field) and they have the ID
        let isAllowed = adminAllowed;

        if (!isAllowed && session) {
            const isIdMatch = order.user && String(order.user) === String(session.user.id);
            const isEmailMatch = order.customerDetails?.email && session.user.email &&
                order.customerDetails.email.toLowerCase() === session.user.email.toLowerCase();

            if (isIdMatch || isEmailMatch) isAllowed = true;
        }

        // If it's a guest order (no user assigned), allow action if they have the order ID
        if (!isAllowed && !order.user) {
            isAllowed = true;
        }

        if (!isAllowed) {
            return NextResponse.json({
                success: false,
                message: session ? 'You do not have permission to modify this order.' : 'Unauthorized access. Please login.'
            }, { status: session ? 403 : 401 });
        }

        if (action === 'cancel') {
            const allowedForCancel = ['Pending', 'Processing', 'Order Confirmed'];
            if (!allowedForCancel.includes(order.status)) {
                return NextResponse.json({
                    success: false,
                    message: `This order is already being ${order.status.toLowerCase()} and cannot be cancelled.`
                }, { status: 400 });
            }

            order.status = 'Cancelled';
            await order.save();

            // Send notification email
            try {
                const { sendOrderStatusEmail } = await import('@/lib/email');
                await sendOrderStatusEmail(order);
            } catch (emailError) {
                console.error('Failed to send status update email:', emailError);
            }

            return NextResponse.json({ success: true, message: 'Order has been cancelled successfully.', data: order });
        }

        if (action === 'return') {
            if (order.status !== 'Delivered') {
                return NextResponse.json({
                    success: false,
                    message: `Returns can only be initiated for delivered orders.`
                }, { status: 400 });
            }

            order.status = 'Return/Replacement Initiated';
            await order.save();

            // Send notification email
            try {
                const { sendOrderStatusEmail } = await import('@/lib/email');
                await sendOrderStatusEmail(order);
            } catch (emailError) {
                console.error('Failed to send status update email:', emailError);
            }

            return NextResponse.json({ success: true, message: 'Return request has been initiated successfully.', data: order });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('User order action error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
