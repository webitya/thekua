import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET(req) {
    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        let errorMsg = error.message;
        if (errorMsg.includes('bad auth')) {
            errorMsg = 'DATABASE AUTH FAILURE: Please verify your MONGODB_URI in .env.local (User/Password mismatch or IP not whitelisted in Atlas)';
        }
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        let errorMsg = error.message;
        if (errorMsg.includes('bad auth')) {
            errorMsg = 'DATABASE AUTH FAILURE: Could not connect to MongoDB. Check your .env.local credentials and make sure magadh_db is correct.';
        }
        return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }
}
