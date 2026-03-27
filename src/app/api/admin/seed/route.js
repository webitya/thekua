import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

const initialProducts = [
    {
        name: "Velvet Matte Stick",
        price: 1599,
        description: "Our signature matte lipstick delivers intense color payoff with a lightweight, velvet feel. Infused with vitamin E for all-day comfort.",
        type: "Bullet Matte Lipstick",
        stock: 50,
        features: ["Long-lasting", "Vitamin E Infused", "Intense Pigment", "Cruelty Free"],
        variants: [
            { name: "Ruby Rush", hex: "#E31B23", image: "https://images.unsplash.com/photo-1586775490184-8804a9cfb096?auto=format&fit=crop&q=80&w=800" },
            { name: "Mauve Magic", hex: "#A36361", image: "https://images.unsplash.com/photo-1591360236480-9c6a4cb3a6de?auto=format&fit=crop&q=80&w=800" },
            { name: "Berry Bold", hex: "#8A2B3E", image: "https://images.unsplash.com/photo-1617300324836-e8d1979b0ee4?auto=format&fit=crop&q=80&w=800" }
        ]
    },
    {
        name: "Liquid Silk Matte",
        price: 2199,
        description: "A weightless liquid lipstick that dries down to a seamless matte finish. Waterproof and smudge-proof formula.",
        type: "Liquid Matte Lipstick",
        stock: 0,
        features: ["Waterproof", "12H Wear", "Silk Feel", "Hyper-Pigmented"],
        variants: [
            { name: "Dusk Rose", hex: "#D48B8E", image: "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?auto=format&fit=crop&q=80&w=800" },
            { name: "Sienna Soul", hex: "#A0522D", image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800" }
        ]
    },
    {
        name: "Crystal Shine Gloss",
        price: 999,
        description: "Experience the ultimate glass-like shine with our Crystal Gloss. Non-sticky and deeply hydrating.",
        type: "Lipgloss",
        stock: 120,
        features: ["High Shine", "Hyaluronic Acid", "Non-Sticky", "Vegan"],
        variants: [
            { name: "Clear Glass", hex: "#FFFFFF", image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=800" }
        ]
    }
];

export async function GET(req) {
    try {
        await dbConnect();
        await Product.deleteMany({});
        const products = await Product.insertMany(initialProducts);
        return NextResponse.json({ success: true, count: products.length }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
