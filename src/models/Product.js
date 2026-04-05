import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Standard Pack", "Gift Box"
    weight: { type: String, required: true }, // e.g., "500g", "1kg"
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // Optional discounted price
    images: { type: [String], default: [] }, // Specific photos for this variant
});

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    type: {
        type: String,
        required: [true, 'Please provide a category'], // e.g., "Classic Thekua", "Festive Gujia"
    },
    images: {
        type: [String], // Array of gallery image URLs
        default: [],
    },
    variants: [VariantSchema],
    ingredients: {
        type: [String],
        default: [],
    },
    shelfLife: {
        type: String,
        required: [true, 'Please specify shelf life'],
    },
    isVeg: {
        type: Boolean,
        default: true,
    },
    allergenInfo: {
        type: String,
        default: 'Contains nuts and dairy.',
    },
    features: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent schema caching issues in Next.js by deleting the model before re-defining
if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

const Product = mongoose.model('Product', ProductSchema);
export default Product;
