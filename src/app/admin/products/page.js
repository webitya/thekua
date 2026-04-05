'use client';

import { useState, useEffect } from 'react';
import {
    Package, Plus, Search, Edit2, Trash2, ExternalLink, ChevronRight, X, Image as ImageIcon, Type, Tag, Layers, Warehouse, Upload, Loader2, ArrowLeft, Leaf, ShieldCheck, Clock, ListChecks, Info
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(null); // 'gallery' or index for variants
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialProductState = {
        name: '',
        type: '', // Category
        description: '',
        shelfLife: '30 Days',
        isVeg: true,
        allergenInfo: 'Made in a facility that processes nuts and dairy.',
        ingredients: [''],
        features: ['Handcrafted', 'Pure Ghee'],
        images: [], // Gallery
        variants: [{ name: 'Standard Pack', weight: '500g', price: '', discountPrice: '', images: [] }]
    };
    const [newProduct, setNewProduct] = useState(initialProductState);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const json = await res.json();
            if (json.success) setProducts(json.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Multi-Image Gallery Upload (Parallel)
    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading('gallery');
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || 'Server error');
                return data.url;
            });

            const urls = await Promise.all(uploadPromises);
            setNewProduct(prev => ({ 
                ...prev, 
                images: [...(prev.images || []), ...urls] 
            }));
        } catch (error) {
            alert('Gallery Sync Failure: ' + error.message);
        } finally {
            setUploading(null);
        }
    };

    const handleRemoveGalleryImage = (idx) => {
        setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    };

    // Variant Handlers
    const handleAddVariant = () => {
        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { name: '', weight: '', price: '', discountPrice: '', images: [] }]
        });
    };

    const handleRemoveVariant = (index) => {
        setNewProduct({ ...newProduct, variants: newProduct.variants.filter((_, i) => i !== index) });
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...newProduct.variants];
        updatedVariants[index][field] = value;
        setNewProduct({ ...newProduct, variants: updatedVariants });
    };

    const handleVariantImageUpload = async (index, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(index);
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || 'Server error');
                return data.url;
            });

            const urls = await Promise.all(uploadPromises);
            
            setNewProduct(prev => {
                const updatedVariants = [...prev.variants];
                updatedVariants[index] = {
                    ...updatedVariants[index],
                    images: [...(updatedVariants[index].images || []), ...urls]
                };
                return { ...prev, variants: updatedVariants };
            });
            
        } catch (error) {
            alert('Variant Asset Crash: ' + error.message);
        } finally {
            setUploading(null);
        }
    };

    const handleRemoveVariantImage = (vIdx, imgIdx) => {
        const updatedVariants = [...newProduct.variants];
        updatedVariants[vIdx].images = updatedVariants[vIdx].images.filter((_, i) => i !== imgIdx);
        setNewProduct({ ...newProduct, variants: updatedVariants });
    };

    // List Handlers
    const handleFieldChange = (field, value) => setNewProduct(prev => ({ ...prev, [field]: value }));

    const handleListChange = (field, idx, value) => {
        const newList = [...newProduct[field]];
        newList[idx] = value;
        setNewProduct(prev => ({ ...prev, [field]: newList }));
    };

    const handleAddListItem = (field) => setNewProduct(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    const handleRemoveListItem = (field, idx) => setNewProduct(prev => ({...prev, [field]: prev[field].filter((_, i) => i !== idx) }));

    const handleEdit = (product) => {
        setEditingId(product._id);
        
        // Ensure all variants have an images array (Safe Hydration)
        const sanitizedProduct = {
            ...product,
            variants: product.variants.map(v => ({
                ...v,
                images: v.images || (v.image ? [v.image] : [])
            }))
        };
        
        setNewProduct(sanitizedProduct);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this snack?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) fetchProducts();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingId ? `/api/products/${editingId}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';

            // DEEP PERSISTENCE: Ensure every field is strictly serialized
            const payload = {
                name: newProduct.name,
                type: newProduct.type,
                description: newProduct.description,
                shelfLife: newProduct.shelfLife,
                isVeg: newProduct.isVeg,
                allergenInfo: newProduct.allergenInfo,
                ingredients: newProduct.ingredients,
                images: newProduct.images, // Main Gallery Sync
                variants: newProduct.variants.map(v => ({ 
                    name: v.name,
                    weight: v.weight,
                    price: Number(v.price),
                    discountPrice: v.discountPrice ? Number(v.discountPrice) : undefined,
                    images: v.images || [] // Variant Gallery Sync
                }))
            };

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                setNewProduct(initialProductState);
                setIsFormOpen(false);
                setEditingId(null);
                fetchProducts();
            } else {
                alert('Persistence Failure: ' + (result.error || result.message || 'Check Server Logs'));
            }
        } catch (error) {
            alert('Network Blockage: Could not reach the Registry API');
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
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black pb-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest leading-none">
                        {isFormOpen ? (editingId ? 'Refine Recipe' : 'New Recipe') : 'Thekua Kitchen Registry'}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Catalogue / Product Management</p>
                </div>
                {!isFormOpen ? (
                    <button
                        onClick={() => { setIsFormOpen(true); setEditingId(null); setNewProduct(initialProductState); }}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-black text-white hover:bg-orange-600 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer shadow-xl shadow-orange-50"
                    >
                        <Plus size={16} />
                        <span>Add New Snack</span>
                    </button>
                ) : (
                    <button
                        onClick={() => { setIsFormOpen(false); setEditingId(null); setNewProduct(initialProductState); }}
                        className="flex items-center space-x-2 px-4 py-2.5 border border-black hover:bg-black hover:text-white transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Discard & Exit</span>
                    </button>
                )}
            </div>

            {!isFormOpen && (
                <div className="flex items-center justify-between gap-6 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 bg-white border border-black/10 px-4 py-2.5 w-full max-w-md focus-within:border-black transition-all">
                        <Search size={14} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter Recipes (e.g. Classic Thekua)"
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')}><X size={12} className="text-gray-400 hover:text-black" /></button>}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Showing {filteredProducts.length} Entries</div>
                </div>
            )}

            {isFormOpen ? (
                /* Snack Creation/Edit Form */
                <div className="bg-white border border-black p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* LEFT: Identifiers & Config */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-black/40">
                                        <Type size={14} />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Base Identity</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Snack Name</label>
                                            <input required type="text" placeholder="e.g. PREMIUM DRY FRUIT THEKUA" className="w-full px-4 py-3 bg-white border border-black text-xs font-bold uppercase tracking-wide focus:bg-gray-50 outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Category / Tag</label>
                                            <input required type="text" placeholder="e.g. FESTIVE COLLECTION" className="w-full px-4 py-3 bg-white border border-black text-xs font-bold uppercase tracking-wide focus:bg-gray-50 outline-none" value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Product Story (Description)</label>
                                        <textarea required rows={4} placeholder="Tell the tradition of this snack..." className="w-full px-4 py-3 bg-white border border-black text-xs font-medium leading-relaxed focus:bg-gray-50 outline-none resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                                    </div>
                                </div>

                                {/* Snack Specifications */}
                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-black/40">
                                        <ShieldCheck size={14} />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Kitchen Specifications</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Shelf Life</label>
                                            <div className="relative">
                                                <input type="text" className="w-full px-4 py-3 bg-white border border-black text-xs font-bold uppercase focus:bg-gray-50 outline-none" value={newProduct.shelfLife} onChange={e => handleFieldChange('shelfLife', e.target.value)} />
                                                <Clock className="absolute right-3 top-3 text-gray-300" size={14} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Dietary Preference</label>
                                            <select className="w-full px-4 py-3 bg-white border border-black text-xs font-bold uppercase focus:bg-gray-50 outline-none appearance-none" value={newProduct.isVeg.toString()} onChange={e => handleFieldChange('isVeg', e.target.value === 'true')}>
                                                <option value="true">100% PUREVEG (VEGETARIAN)</option>
                                                <option value="false">NON-VEGETARIAN / EGGS</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Allergen Disclaimer</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white border border-black text-xs font-bold uppercase focus:bg-gray-50 outline-none" value={newProduct.allergenInfo} onChange={e => handleFieldChange('allergenInfo', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Variants / Pack Sizes */}
                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-black">
                                        <div className="flex items-center gap-2 text-black/40">
                                            <Layers size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Packaging Options</h3>
                                        </div>
                                        <button type="button" onClick={handleAddVariant} className="text-[9px] font-bold uppercase bg-black text-white px-3 py-1.5 cursor-pointer hover:bg-gray-800 transition-all">Add Pack Size +</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {newProduct.variants.map((v, idx) => (
                                            <div key={idx} className="p-4 border border-black bg-gray-50/20 space-y-4 group transition-all hover:bg-white relative">
                                                {newProduct.variants.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveVariant(idx)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                                )}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Label</label>
                                                        <input required type="text" placeholder="Standard Pack" className="w-full px-2 py-2 bg-transparent border-b border-black text-[10px] font-bold uppercase outline-none" value={v.name} onChange={e => handleVariantChange(idx, 'name', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Weight (Net)</label>
                                                        <input required type="text" placeholder="500g" className="w-full px-2 py-2 bg-transparent border-b border-black text-[10px] font-bold uppercase outline-none" value={v.weight} onChange={e => handleVariantChange(idx, 'weight', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 items-end">
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Base Price (₹)</label>
                                                        <input required type="number" className="w-full px-2 py-2 bg-transparent border-b border-black text-[10px] font-bold outline-none" value={v.price} onChange={e => handleVariantChange(idx, 'price', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-bold text-orange-400 uppercase tracking-widest text-right block">Offer Price (₹)</label>
                                                        <input type="number" placeholder="Optional" className="w-full px-2 py-2 bg-transparent border-b border-orange-200 text-[10px] font-bold outline-none text-orange-600 placeholder:text-orange-200" value={v.discountPrice} onChange={e => handleVariantChange(idx, 'discountPrice', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input type="file" multiple className="hidden" id={`v-img-${idx}`} onChange={(e) => handleVariantImageUpload(idx, e)} />
                                                    <label htmlFor={`v-img-${idx}`} className="flex-1 text-center border border-black/10 bg-white text-[8px] font-bold uppercase py-2 cursor-pointer hover:bg-black hover:text-white transition-all">
                                                        {uploading === idx ? '...' : (v.images?.length > 0 ? 'MEDIA REGISTRY' : 'ATTACH PRODUCT ASSETS')}
                                                    </label>
                                                </div>
                                                {v.images?.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-1.5 overflow-hidden mt-1">
                                                        {v.images.map((img, iIdx) => (
                                                            <div key={iIdx} className="h-10 relative border border-gray-100 group/img">
                                                                <Image src={img} alt={`${v.name} ${iIdx}`} fill className="object-cover" />
                                                                <button type="button" onClick={() => handleRemoveVariantImage(idx, iIdx)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"><X size={10} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Visual Assets & Metadata */}
                            <div className="lg:col-span-4 space-y-10">
                                {/* Multi-Image Gallery */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-black/40">
                                            <ImageIcon size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Lifestyle Gallery</h3>
                                        </div>
                                        <div className="relative">
                                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleGalleryUpload} />
                                            <button type="button" className="text-[9px] font-bold uppercase bg-black text-white px-2 py-1 flex items-center gap-1">Add Assets +</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {newProduct.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square border border-gray-100 group overflow-hidden">
                                                <Image src={img} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="absolute top-1 right-1 p-1 bg-black text-white opacity-0 group-hover:opacity-100 transition-all"><X size={10} /></button>
                                            </div>
                                        ))}
                                        {uploading === 'gallery' && (
                                            <div className="aspect-square border border-dashed border-gray-200 flex items-center justify-center animate-pulse"><Upload size={16} /></div>
                                        )}
                                    </div>
                                </div>

                                {/* Ingredients & Highlights */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-black/40">
                                            <div className="flex items-center gap-2">
                                                <ListChecks size={14} />
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest">Base Ingredients</h3>
                                            </div>
                                            <button type="button" onClick={() => handleAddListItem('ingredients')} className="hover:text-black transition-colors"><Plus size={14} /></button>
                                        </div>
                                        <div className="space-y-1.5">
                                            {newProduct.ingredients.map((item, idx) => (
                                                <div key={idx} className="flex gap-2 group">
                                                    <input type="text" placeholder="Component..." className="flex-1 px-3 py-1.5 border border-black bg-white text-[10px] font-bold outline-none uppercase" value={item} onChange={e => handleListChange('ingredients', idx, e.target.value)} />
                                                    <button type="button" onClick={() => handleRemoveListItem('ingredients', idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submission */}
                        <div className="flex justify-end pt-8 border-t border-black">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-80 bg-black text-white py-5 font-bold uppercase tracking-[0.4em] text-[12px] hover:bg-orange-600 disabled:bg-gray-400 transition-all border border-black flex items-center justify-center shadow-xl"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'CONFIRM CHANGES' : 'PUBLISH COLLECTION')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Registry / List View */
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white border border-black p-4 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-16 w-14 shrink-0 bg-white relative border border-gray-100">
                                        <Image src={product.variants[0]?.images?.[0] || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-bold text-gray-900 uppercase truncate">{product.name}</h3>
                                        <p className="text-[9px] font-semibold text-orange-600 uppercase">{product.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900">₹{(product.variants[0]?.discountPrice || product.variants[0]?.price)?.toLocaleString()}</div>
                                        <div className="text-[8px] text-gray-400 uppercase">{product.variants[0]?.weight}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${product.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                                        <span className="text-[9px] font-bold text-gray-500 uppercase">{product.shelfLife} FRESH</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => handleEdit(product)} className="text-[10px] font-bold text-black uppercase border-b border-black">Edit</button>
                                        <button onClick={() => handleDelete(product._id)} className="text-[10px] font-bold text-red-600 uppercase">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white border border-black overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-black">
                                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Snack Identity</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Specifications</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-14 w-12 shrink-0 relative border border-gray-200">
                                                        <Image src={product.variants[0]?.images?.[0] || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{product.name}</div>
                                                        <div className="text-[8px] text-orange-600 font-bold uppercase">{product.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${product.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                                                    <span className="text-[9px] font-bold text-gray-900 uppercase">{product.isVeg ? 'VEG' : 'NON-VEG'}</span>
                                                    <span className="text-[8px] text-gray-400">/ {product.shelfLife}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">₹{(product.variants[0]?.discountPrice || product.variants[0]?.price)?.toLocaleString()}</div>
                                                <div className="text-[9px] text-gray-400 uppercase tracking-widest">Base Variant</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => handleEdit(product)} className="p-2 border border-black hover:bg-black hover:text-white transition-all"><Edit2 size={10} /></button>
                                                    <button onClick={() => handleDelete(product._id)} className="p-2 border border-gray-100 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={10} /></button>
                                                    <Link href={`/product/${product._id}`} target="_blank" className="p-2 bg-gray-50 text-black hover:bg-black hover:text-white transition-all"><ExternalLink size={10} /></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-[10px] font-bold text-gray-300 uppercase">No Snacks Registered</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
