import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hex: { type: String, required: true },
    image: { type: String, required: true }, // URL to image
});

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    type: {
        type: String,
        required: [true, 'Please provide a product type'], // e.g., "Lipstick", "Lipgloss"
    },
    variants: [VariantSchema],
    features: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
