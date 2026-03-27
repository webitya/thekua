import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const getStatusDetails = (status, order) => {
    switch (status) {
        case 'Order Confirmed':
            return {
                subject: 'High Five! Your order is confirmed 🥂',
                title: 'Order Confirmed',
                message: "Great news! Your payment was successful and your order is now officially confirmed. We're starting to prep your aesthetic essentials with care.",
                color: '#10b981',
                icon: '✅'
            };
        case 'Processing':
            return {
                subject: 'Developing your glow... Order in Process 🕒',
                title: 'Processing Order',
                message: "We're currently gathering your items and preparing them for shipment. Quality checks are in progress to ensure everything meets our luxury standards.",
                color: '#8b5cf6',
                icon: '✨'
            };
        case 'Shipped':
            return {
                subject: 'On its way! Your order has been shipped 🚚',
                title: 'Order Shipped',
                message: `Exciting news! Your order is out for delivery. You can track it using the details below. Stay ready for your glow up!`,
                color: '#3b82f6',
                icon: '🚚'
            };
        case 'Delivered':
            return {
                subject: 'Delivered! Time to unlock your beauty ✨',
                title: 'Order Delivered',
                message: "Your Areum package has arrived! We hope you love your new products. Don't forget to share your glow with us on social media.",
                color: '#22c55e',
                icon: '🎁'
            };
        case 'Cancelled':
            return {
                subject: 'Update regarding your order cancellation ❌',
                title: 'Order Cancelled',
                message: "Your order has been cancelled. If you didn't request this, please contact our support team immediately. Any payments made will be refunded as per our policy.",
                color: '#ef4444',
                icon: '✕'
            };
        case 'Return/Replacement Initiated':
            return {
                subject: 'Return/Replacement request received 🔄',
                title: 'Return Initiated',
                message: "We've received your request for a return/replacement. Our team is reviewing the details and will get back to you with the next steps shortly.",
                color: '#f59e0b',
                icon: '🔄'
            };
        case 'Refund completed':
            return {
                subject: 'Refund Processed successfully 💰',
                title: 'Refund Completed',
                message: "Transition complete. Your refund has been processed and should reflect in your original payment method within 5-7 business days.",
                color: '#10b981',
                icon: '💰'
            };
        default:
            return {
                subject: `Update on your Order #${order._id.toString().slice(-6).toUpperCase()}`,
                title: 'Order Update',
                message: `There's a new update on your order. Current status: ${status}. Check the link below for full details.`,
                color: '#000000',
                icon: '🔔'
            };
    }
};

export const sendOrderStatusEmail = async (order, customStatus = null) => {
    const status = customStatus || order.status;
    const { customerDetails, items, totalAmount, _id } = order;
    const statusDetails = getStatusDetails(status, order);
    const trackingLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.areum.in'}/track-order?id=${_id}`;

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td width="64" style="vertical-align: top;">
                            <img src="${item.image}" alt="${item.name}" width="54" height="54" style="width: 54px; height: 54px; object-fit: cover; border-radius: 12px; border: 1px solid #f1f5f9;">
                        </td>
                        <td style="padding-left: 16px; vertical-align: middle;">
                            <p style="margin: 0; font-weight: 700; color: #0f172a; font-size: 14px; line-height: 1.4;">${item.name}</p>
                            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Shade: ${item.variantName} • Qty: ${item.quantity}</p>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; text-align: right; vertical-align: middle;">
                <p style="margin: 0; font-weight: 700; color: #0f172a; font-size: 14px;">₹${(item.price * item.quantity).toLocaleString()}</p>
            </td>
        </tr>
    `).join('');

    const mailOptions = {
        from: `"Areum Luxe" <${process.env.EMAIL_USER}>`,
        to: customerDetails.email,
        subject: statusDetails.subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${statusDetails.title}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; -webkit-font-smoothing: antialiased;">
                <div style="display: none; max-height: 0px; overflow: hidden;">
                    ${statusDetails.message.substring(0, 100)}...
                </div>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #000000; padding: 48px 20px; text-align: center;">
                                        <p style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 12px; font-weight: 900; text-transform: uppercase;">AREUM</p>
                                    </td>
                                </tr>

                                <!-- Hero Status -->
                                <tr>
                                    <td style="padding: 56px 48px 40px 48px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td>
                                                    <div style="display: inline-block; background-color: ${statusDetails.color}15; color: ${statusDetails.color}; padding: 8px 16px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">
                                                       ${statusDetails.icon} ${status}
                                                    </div>
                                                    <h1 style="margin: 0 0 16px 0; color: #0f172a; font-size: 28px; font-weight: 800; line-height: 1.2;">Hi ${customerDetails.name},</h1>
                                                    <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.7;">
                                                        ${statusDetails.message.replace(/\n/g, '<br>')}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Order Summary Box -->
                                <tr>
                                    <td style="padding: 0 48px;">
                                        <div style="background-color: #fdfdfd; border: 1px solid #f1f5f9; border-radius: 28px; padding: 32px; overflow: hidden;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td>
                                                                    <p style="margin: 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Order ID</p>
                                                                    <p style="margin: 6px 0 0 0; color: #0f172a; font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight: 700;">#${_id}</p>
                                                                </td>
                                                                <td align="right">
                                                                    <p style="margin: 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Tracking</p>
                                                                    <p style="margin: 6px 0 0 0; color: ${statusDetails.color}; font-size: 13px; font-weight: 700;">LIVE STATUS</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 10px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            ${itemsHtml}
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 24px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="color: #64748b; font-size: 14px; font-weight: 600;">Subtotal</td>
                                                                <td align="right" style="color: #0f172a; font-size: 16px; font-weight: 700;">₹${totalAmount.toLocaleString()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 8px; color: #64748b; font-size: 14px; font-weight: 600;">Shipping</td>
                                                                <td align="right" style="padding-top: 8px; color: #10b981; font-size: 14px; font-weight: 700;">FREE</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 20px; border-top: 1px solid #f1f5f9; color: #0f172a; font-size: 16px; font-weight: 800;">
                                                                    ${order.paymentMethod === 'COD' ? 'Total Payable' : 'Total Paid'}
                                                                </td>
                                                                <td align="right" style="padding-top: 20px; border-top: 1px solid #f1f5f9; color: #000000; font-size: 24px; font-weight: 900;">
                                                                    ₹${totalAmount.toLocaleString()}
                                                                </td>
                                                            </tr>
                                                            ${order.paymentMethod === 'COD' ? `
                                                            <tr>
                                                                <td colspan="2" style="padding-top: 8px; text-align: right;">
                                                                    <span style="background-color: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">Pay on Delivery</span>
                                                                </td>
                                                            </tr>
                                                            ` : ''}
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>

                                <!-- CTA -->
                                <tr>
                                    <td style="padding: 48px; text-align: center;">
                                        <a href="${trackingLink}" style="background-color: #000000; color: #ffffff; padding: 22px 48px; border-radius: 20px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; display: inline-block; box-shadow: 0 15px 30px rgba(0,0,0,0.15);">
                                            Track My Order
                                        </a>
                                        <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 500;">
                                            Need help? Reply to this email or visit <a href="https://www.areum.in/contact" style="color: #000; text-decoration: underline;">Support</a>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Shipping Details Grid -->
                                <tr>
                                    <td style="padding: 0 48px 48px 48px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 24px; padding: 24px;">
                                            <tr>
                                                <td width="50%" style="vertical-align: top; padding-right: 12px;">
                                                    <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Ships to</p>
                                                    <p style="margin: 0; color: #0f172a; font-size: 13px; font-weight: 700; line-height: 1.5;">
                                                        ${customerDetails.name}<br>
                                                        <span style="font-weight: 500; color: #475569;">${customerDetails.address}</span>
                                                    </p>
                                                </td>
                                                <td width="50%" style="vertical-align: top; padding-left: 12px; border-left: 1px solid #e2e8f0;">
                                                    <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">City & Zip</p>
                                                    <p style="margin: 0; color: #0f172a; font-size: 13px; font-weight: 700; line-height: 1.5;">
                                                        ${customerDetails.city}<br>
                                                        <span style="font-weight: 500; color: #475569;">${customerDetails.zip}</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #fafafa; padding: 48px 40px; text-align: center;">
                                        <p style="margin: 0 0 24px 0; color: #0f172a; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">AREUM LUXE</p>
                                        <p style="margin: 0 0 32px 0; color: #94a3b8; font-size: 12px; line-height: 1.8; max-width: 300px; margin-left: auto; margin-right: auto;">
                                            Join the community of luxury beauty lovers and share your glow.
                                        </p>
                                        <div style="margin-bottom: 32px;">
                                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #e2e8f0; margin: 0 4px;"></span>
                                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #e2e8f0; margin: 0 4px;"></span>
                                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #e2e8f0; margin: 0 4px;"></span>
                                        </div>
                                        <p style="margin: 0; color: #cbd5e1; font-size: 11px; font-weight: 500; letter-spacing: 0.5px;">
                                            &copy; ${new Date().getFullYear()} AREUM LUXE BEAUTY PVT LTD.
                                            <br>All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order status (${status}) email sent to:`, customerDetails.email);
        return { success: true };
    } catch (error) {
        console.error('Email Send Error:', error);
        return { success: false, error };
    }
};

export const sendOrderConfirmationEmail = async (order) => {
    return sendOrderStatusEmail(order, 'Order Confirmed');
};
