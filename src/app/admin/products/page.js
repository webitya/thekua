'use client';

import { useState, useEffect } from 'react';
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    ChevronRight,
    X,
    Image as ImageIcon,
    Type,
    Tag,
    Layers,
    Warehouse,
    Upload,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track if editing

    const initialProductState = {
        name: '',
        type: '',
        price: '',
        description: '',
        stock: '',
        features: [''],
        variants: [{ name: '', hex: '#000000', image: '' }]
    };
    const [newProduct, setNewProduct] = useState(initialProductState);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const json = await res.json();
            if (json.success) {
                setProducts(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddVariant = () => {
        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { name: '', hex: '#000000', image: '' }]
        });
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, variants: updatedVariants });
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...newProduct.variants];
        updatedVariants[index][field] = value;
        setNewProduct({ ...newProduct, variants: updatedVariants });
    };

    const handleImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(index);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                handleVariantChange(index, 'image', data.url);
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image');
        } finally {
            setUploading(null);
        }
    };

    const handleAddFeature = () => {
        setNewProduct({
            ...newProduct,
            features: [...newProduct.features, '']
        });
    };

    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...newProduct.features];
        updatedFeatures[index] = value;
        setNewProduct({ ...newProduct, features: updatedFeatures });
    };

    const handleRemoveFeature = (index) => {
        const updatedFeatures = newProduct.features.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, features: updatedFeatures });
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setNewProduct({
            ...product,
            price: product.price.toString(),
            stock: product.stock.toString(),
            features: product.features.length > 0 ? product.features : ['']
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingId ? `/api/products/${editingId}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newProduct,
                    price: Number(newProduct.price),
                    stock: Number(newProduct.stock),
                    features: newProduct.features.filter(f => f.trim() !== '')
                }),
            });

            if (res.ok) {
                setNewProduct(initialProductState);
                setIsFormOpen(false);
                setEditingId(null);
                fetchProducts();
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving product');
        } finally {
            setSaving(false);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header section - Compact Title */}
            <div className="flex items-center justify-between border-b border-black pb-4">
                <div>
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest leading-none">
                        {isFormOpen ? (editingId ? 'Edit Item' : 'Item Creation') : 'Inventory Master'}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">
                        Areum Catalog Management
                    </p>
                </div>
                {isFormOpen && (
                    <button
                        onClick={() => {
                            setIsFormOpen(false);
                            setEditingId(null);
                            setNewProduct(initialProductState);
                        }}
                        className="flex items-center space-x-2 px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} />
                        <span>Discard & Exit</span>
                    </button>
                )}
            </div>

            {isFormOpen ? (
                /* Compact Full Section: Add/Edit Product Form */
                <div className="bg-white border border-black p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Primary Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 border-l-2 border-black">Item Specifications</h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identification</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="PRODUCT NAME"
                                            className="w-full px-3 py-2.5 bg-white border border-black rounded-none focus:bg-gray-50 outline-none transition-all text-xs font-bold"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="COLLECTION"
                                                className="w-full px-3 py-2.5 bg-white border border-black rounded-none focus:bg-gray-50 outline-none transition-all text-xs font-bold"
                                                value={newProduct.type}
                                                onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price (INR)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-3 py-2.5 bg-white border border-black rounded-none focus:bg-gray-50 outline-none transition-all text-xs font-bold"
                                                value={newProduct.price}
                                                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Units</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-3 py-2.5 bg-white border border-black rounded-none focus:bg-gray-50 outline-none transition-all text-xs font-bold"
                                                value={newProduct.stock}
                                                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Marketing Copy</label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="PRODUCT DESCRIPTION..."
                                            className="w-full px-3 py-2.5 bg-white border border-black rounded-none focus:bg-gray-50 outline-none transition-all resize-none text-xs leading-relaxed"
                                            value={newProduct.description}
                                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Features Panel */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 border-l-2 border-black">Highlights</h3>
                                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {newProduct.features.map((feature, idx) => (
                                        <div key={idx} className="flex space-x-1">
                                            <input
                                                type="text"
                                                placeholder={`FEATURE #${idx + 1}`}
                                                className="flex-1 px-3 py-2 bg-white border border-black rounded-none outline-none text-[10px] font-bold"
                                                value={feature}
                                                onChange={e => handleFeatureChange(idx, e.target.value)}
                                            />
                                            {newProduct.features.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveFeature(idx)} className="p-2 border border-black hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="w-full py-2 border border-dashed border-black text-[9px] font-black text-black hover:bg-gray-50 uppercase tracking-widest transition-all"
                                    >
                                        Insert New +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Variants Management */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-black pb-1">
                                <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Sku Variants</h3>
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="text-[9px] bg-black text-white px-3 py-1.5 uppercase font-black tracking-widest hover:bg-gray-800 transition-all"
                                >
                                    Add Shade +
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {newProduct.variants.map((variant, idx) => (
                                    <div key={idx} className="p-4 border border-black bg-white space-y-3 relative group">
                                        {newProduct.variants.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveVariant(idx)}
                                                className="absolute top-1 right-1 p-1 text-gray-300 hover:text-red-600 transition-all"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                        <input
                                            required
                                            type="text"
                                            placeholder="VARIANT NAME"
                                            className="w-full px-2 py-1.5 border border-black bg-white rounded-none text-[10px] font-black outline-none focus:bg-gray-50 uppercase"
                                            value={variant.name}
                                            onChange={e => handleVariantChange(idx, 'name', e.target.value)}
                                        />
                                        <div className="grid grid-cols-5 gap-2">
                                            <input
                                                type="color"
                                                className="col-span-1 w-full h-8 rounded-none border border-black cursor-pointer bg-white p-0.5"
                                                value={variant.hex}
                                                onChange={e => handleVariantChange(idx, 'hex', e.target.value)}
                                            />
                                            <div className="col-span-4 flex space-x-1">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id={`upload-${idx}`}
                                                    onChange={(e) => handleImageUpload(idx, e)}
                                                />
                                                <label
                                                    htmlFor={`upload-${idx}`}
                                                    className="flex-1 h-8 border border-black text-[9px] font-black flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all bg-white uppercase tracking-tighter"
                                                >
                                                    {uploading === idx ? '...' : 'UPLOAD'}
                                                </label>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="IMAGE URL (OPTIONAL)"
                                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-none text-[8px] outline-none focus:border-black transition-all"
                                            value={variant.image}
                                            onChange={e => handleVariantChange(idx, 'image', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-56 bg-black text-white py-4 font-black uppercase tracking-[0.4em] text-[11px] hover:bg-gray-800 disabled:bg-gray-400 transition-all border border-black flex items-center justify-center"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'UPDATE ITEM' : 'DEPLOY TO SHOP')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Compact Pro Section: Product Table */
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col md:flex-row gap-3 items-center bg-white border border-black p-3 shadow-sm">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="FILTER BY NAME, COLLECTION..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-black rounded-none outline-none focus:bg-white transition-all text-[10px] font-black uppercase tracking-widest"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setIsFormOpen(true);
                                setEditingId(null);
                                setNewProduct(initialProductState);
                            }}
                            className="bg-black text-white px-6 py-2.5 font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all border border-black w-full md:w-auto flex items-center justify-center"
                        >
                            <Plus size={14} className="mr-2" /> CREATE ITEM
                        </button>
                    </div>

                    <div className="bg-white border border-black overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr className="divide-x divide-gray-800">
                                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em]">ITEM DESCRIPTION</th>
                                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em]">FINANCIALS</th>
                                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em]">AVAILABILITY</th>
                                    <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-[0.3em]">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors group divide-x divide-gray-50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 shrink-0 bg-gray-100 relative border border-black">
                                                    {product.variants[0]?.image && (
                                                        <Image src={product.variants[0].image} alt={product.name} fill className="object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{product.name}</div>
                                                    <div className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.1em]">{product.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="text-xs font-black text-gray-900">₹{product.price.toLocaleString()}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-1.5 w-1.5 ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{product.stock} UNIT</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1.5 border border-black hover:bg-black hover:text-white transition-all text-gray-900"
                                                    title="EDIT"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-1.5 border border-gray-100 text-gray-300 hover:border-red-500 hover:text-red-500 transition-all"
                                                    title="DELETE"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <Link href={`/product/${product._id}`} target="_blank" className="p-1.5 border border-black hover:bg-black hover:text-white transition-all text-gray-900" title="PREVIEW"><ExternalLink size={12} /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-16 text-center">
                                            <Package className="mx-auto text-gray-100 mb-3" size={40} />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">DATABASE EMPTY</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
