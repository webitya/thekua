import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

const initialProducts = [
    {
        name: "Classic Wheat Thekua",
        price: 349,
        description: "Our signature Thekua is handcrafted using premium whole wheat flour, pure desi ghee, and organic jaggery. Each piece is flavored with cardamom and dry fruits for an authentic homemade taste.",
        type: "Thekua",
        stock: 100,
        features: ["Pure Desi Ghee", "Organic Jaggery", "High Fiber", "No Preservatives"],
        variants: [
            { name: "Original Jaggery", hex: "#8B4513", image: "/snacks.png" },
            { name: "Coconut Special", hex: "#F5DEB3", image: "/snacks.png" },
            { name: "Dry Fruit Rich", hex: "#D2691E", image: "/snacks.png" }
        ]
    },
    {
        name: "Royal Mawa Gujia",
        price: 599,
        description: "Exquisite handmade pastries filled with a rich mixture of roasted khoya, dry fruits, and aromatic cardamom. A sweet celebration of Indian heritage in every bite.",
        type: "Gujia",
        stock: 50,
        features: ["Fresh Khoya", "Pure Saffron", "Handmade Artistry", "Festive Grade"],
        variants: [
            { name: "Saffron Classic", hex: "#FFD700", image: "/snacks.png" },
            { name: "Chocolate Infused", hex: "#3C1E08", image: "/snacks.png" }
        ]
    },
    {
        name: "Spicy Masala Nimkin",
        price: 249,
        description: "Crunchy, savory salt-crusted snacks tempered with black pepper and nigella seeds. The quintessental Indian savory for your perfect cup of tea.",
        type: "Nimkin",
        stock: 150,
        features: ["Extra Crunchy", "Stone-ground Spices", "Zero Trans Fat", "Tea-time Essential"],
        variants: [
            { name: "Black Pepper", hex: "#333333", image: "/snacks.png" }
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
