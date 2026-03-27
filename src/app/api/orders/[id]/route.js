import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAdmin } from '@/lib/admin-auth';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const paramsData = await params;
        const { id } = paramsData;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order }, { status: 200 });
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        if (!await isAdmin()) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            }, { status: 403 });
        }

        const paramsData = await params;
        const { id } = paramsData;
        const body = await req.json();

        console.log('PATCH Order Request:', { id, body });

        const updateData = {};
        if (body.status) updateData.status = body.status;
        if (body.trackingNumber !== undefined) updateData.trackingNumber = body.trackingNumber;
        if (body.courierPartner !== undefined) updateData.courierPartner = body.courierPartner;

        console.log('Updating Order with data:', updateData);

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!order) {
            console.log('PATCH Order: Order not found', id);
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        console.log('Order updated successfully:', order._id);

        // Send status update email
        if (body.status) {
            try {
                const { sendOrderStatusEmail } = await import('@/lib/email');
                await sendOrderStatusEmail(order);
            } catch (emailError) {
                console.error('Failed to send status update email:', emailError);
            }
        }

        return NextResponse.json({ success: true, data: order }, { status: 200 });
    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
