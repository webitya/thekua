'use client';

import { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Eye,
    CheckCircle2,
    Clock,
    Truck,
    PackageCheck,
    X,
    User,
    CreditCard,
    FileText,
    Copy,
    Check
} from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [trackingInfo, setTrackingInfo] = useState({ number: '', partner: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const json = await res.json();
            if (json.success) {
                setOrders(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setTrackingInfo({
            number: order.trackingNumber || '',
            partner: order.courierPartner || ''
        });
        setShowModal(true);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            const json = await res.json();
            if (json.success) {
                const updatedOrder = json.data;
                setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? updatedOrder : o));
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder(updatedOrder);
                }
            } else {
                alert(`Failed to update status: ${json.message}`);
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateTracking = async () => {
        if (!selectedOrder) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${selectedOrder._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trackingNumber: trackingInfo.number,
                    courierPartner: trackingInfo.partner
                }),
            });

            const json = await res.json();
            if (json.success) {
                const updatedOrder = json.data;
                setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                setSelectedOrder(updatedOrder);
                alert('Tracking info saved successfully');
            } else {
                alert(`Error: ${json.message || 'Failed to save tracking info'}`);
            }
        } catch (error) {
            console.error('Failed to update tracking:', error);
            alert('An error occurred while saving tracking information.');
        } finally {
            setUpdating(false);
        }
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const filteredOrders = filter === 'All'
        ? orders
        : orders.filter(o => o.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Refund completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Order Confirmed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Processing': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Return/Replacement Initiated': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const statusOptions = ['Pending', 'Processing', 'Order Confirmed', 'Shipped', 'Delivered', 'Return/Replacement Initiated', 'Refund completed', 'Cancelled'];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and track your customer orders</p>
                </div>

                {/* Simplified Search/Filter Area */}
                <div className="flex flex-wrap items-center gap-2">
                    {['All', ...statusOptions].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${filter === status
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table - Solid Design */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 group/id">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(order._id, `tableId-${order._id}`)}
                                                    className="opacity-0 group-hover/id:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                                                >
                                                    {copiedField === `tableId-${order._id}` ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customerDetails.name}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[150px]">{order.customerDetails.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] text-gray-400 font-medium uppercase">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                                                {order.paymentMethod === 'COD' && (
                                                    <>
                                                        <span className="w-0.5 h-2.5 bg-gray-200"></span>
                                                        <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-tighter">Pay on Delivery</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${getStatusStyle(order.status)}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No orders found matching this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-900">Order Information</h2>
                                <button
                                    onClick={() => copyToClipboard(selectedOrder._id, 'orderId')}
                                    className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-1.5 group"
                                >
                                    #{selectedOrder._id.toUpperCase()}
                                    {copiedField === 'orderId' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500 group-hover:text-blue-600 transition-colors" />}
                                </button>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Simple Status Progress */}
                            <div className="space-y-4">
                                <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                                    <div className="flex items-center justify-between min-w-[900px] px-8">
                                        {statusOptions.map((status, index, arr) => {
                                            const statusPriority = {
                                                'Pending': 0,
                                                'Processing': 1,
                                                'Order Confirmed': 2,
                                                'Shipped': 3,
                                                'Delivered': 4,
                                                'Return/Replacement Initiated': 5,
                                                'Refund completed': 6,
                                                'Cancelled': 7
                                            };

                                            const currentPriority = statusPriority[selectedOrder.status] || 0;
                                            const stepPriority = statusPriority[status] || 0;
                                            const isDone = stepPriority <= currentPriority && (selectedOrder.status !== 'Cancelled' || status === 'Cancelled' || stepPriority < statusPriority['Cancelled']);

                                            // Handle cancelled special case for progress line
                                            const lineDone = stepPriority < currentPriority;

                                            return (
                                                <div key={status} className="flex-1 flex flex-col items-center relative">
                                                    {/* Connecting Line */}
                                                    {index < arr.length - 1 && (
                                                        <div className={`absolute top-4 left-1/2 w-full h-0.5 ${lineDone ? 'bg-black' : 'bg-gray-100'}`} />
                                                    )}

                                                    {/* Status Circle */}
                                                    <button
                                                        onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                                                        disabled={updating}
                                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all ${isDone
                                                            ? (status === 'Cancelled' ? 'bg-red-500 border-red-500 text-white' : 'bg-black border-black text-white')
                                                            : 'bg-white border-gray-200 text-gray-300'
                                                            } ${status === selectedOrder.status ? 'ring-4 ring-black/5 scale-110' : 'hover:scale-105 hover:border-black'}`}
                                                    >
                                                        {isDone ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                                    </button>

                                                    {/* Label */}
                                                    <span className={`mt-3 text-[8px] font-bold uppercase tracking-tighter text-center px-1 leading-tight ${status === selectedOrder.status ? 'text-black' : 'text-gray-400'}`}>
                                                        {status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {selectedOrder.status === 'Cancelled' && (
                                    <div className="bg-red-50 text-red-600 text-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-red-100">
                                        This order has been cancelled
                                    </div>
                                )}
                            </div>

                            {/* Tracking Info Management */}
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Shipment Tracking</h3>
                                    {selectedOrder.trackingNumber && (
                                        <button
                                            onClick={() => copyToClipboard(selectedOrder.trackingNumber, 'trackNum')}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            {copiedField === 'trackNum' ? <><Check size={10} className="text-green-500" /> COPIED</> : <><Copy size={10} className="text-blue-500" /> COPY TRACKING #</>}
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Tracking Number</label>
                                        <input
                                            type="text"
                                            value={trackingInfo.number}
                                            onChange={(e) => setTrackingInfo(prev => ({ ...prev, number: e.target.value }))}
                                            placeholder="e.g. 1Z999AA10123456784"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Courier Partner</label>
                                        <input
                                            type="text"
                                            value={trackingInfo.partner}
                                            onChange={(e) => setTrackingInfo(prev => ({ ...prev, partner: e.target.value }))}
                                            placeholder="e.g. Delhivery, Bluedart"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdateTracking}
                                    disabled={updating}
                                    className="w-full py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-all"
                                >
                                    {updating ? 'Updating...' : 'Save Tracking Information'}
                                </button>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Customer Card */}
                                <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                                        <User size={14} />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Customer</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.customerDetails.name}</p>
                                            <button
                                                onClick={() => copyToClipboard(selectedOrder.customerDetails.email, 'email')}
                                                className="text-xs text-blue-600 truncate flex items-center gap-1.5 hover:underline group"
                                            >
                                                {selectedOrder.customerDetails.email}
                                                {copiedField === 'email' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </button>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Shipping Address</p>
                                                <button
                                                    onClick={() => copyToClipboard(`${selectedOrder.customerDetails.address}, ${selectedOrder.customerDetails.city}, ${selectedOrder.customerDetails.zip}`, 'fullAddress')}
                                                    className="text-[9px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 uppercase"
                                                >
                                                    {copiedField === 'fullAddress' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500" />}
                                                    Copy All
                                                </button>
                                            </div>

                                            <div className="space-y-1.5 container-address">
                                                <div className="flex items-start justify-between group/line">
                                                    <p className="text-xs text-gray-700 leading-snug flex-1">{selectedOrder.customerDetails.address}</p>
                                                    <button onClick={() => copyToClipboard(selectedOrder.customerDetails.address, 'addr')} className="opacity-0 group-hover/line:opacity-100 p-1 hover:bg-white rounded transition-all ml-2 border border-transparent hover:border-gray-100 shadow-sm">
                                                        {copiedField === 'addr' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500" />}
                                                    </button>
                                                </div>

                                                <div className="flex items-start justify-between group/city">
                                                    <p className="text-xs text-gray-700">{selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.zip}</p>
                                                    <button onClick={() => copyToClipboard(selectedOrder.customerDetails.zip, 'zip')} className="opacity-0 group-hover/city:opacity-100 p-1 hover:bg-white rounded transition-all ml-2 border border-transparent hover:border-gray-100 shadow-sm">
                                                        {copiedField === 'zip' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500" />}
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between group/phone pt-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">Phone</span>
                                                        <p className="text-xs font-bold text-gray-900">{selectedOrder.customerDetails.phone}</p>
                                                    </div>
                                                    <button onClick={() => copyToClipboard(selectedOrder.customerDetails.phone, 'phone')} className="opacity-0 group-hover/phone:opacity-100 p-1 hover:bg-white rounded transition-all ml-2 border border-transparent hover:border-gray-100 shadow-sm">
                                                        {copiedField === 'phone' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Card */}
                                <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                                        <CreditCard size={14} />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Payment Details</h3>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100/50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Method</span>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-gray-900 block">{selectedOrder.paymentMethod}</span>
                                                {selectedOrder.paymentMethod === 'COD' && (
                                                    <span className="text-[8px] font-bold text-yellow-600 uppercase tracking-tighter">Pay on Delivery</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100/50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${selectedOrder.paymentStatus === 'Completed' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'
                                                }`}>
                                                {selectedOrder.paymentStatus}
                                            </span>
                                        </div>
                                        {selectedOrder.transactionId && (
                                            <div className="pt-2">
                                                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1.5 tracking-widest pl-1">Transaction ID</p>
                                                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-100 group/txn transition-all hover:border-blue-200">
                                                    <p className="text-[10px] font-bold text-gray-600 truncate mr-2">{selectedOrder.transactionId}</p>
                                                    <button
                                                        onClick={() => copyToClipboard(selectedOrder.transactionId, 'txnId')}
                                                        className="flex-shrink-0 p-1 hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        {copiedField === 'txnId' ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-blue-500 group-hover/txn:text-blue-600" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-black text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-2 mb-4 text-gray-400">
                                            <FileText size={14} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Order Items</h3>
                                        </div>

                                        <div className="flex-1 space-y-3 mb-6">
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>Subtotal</span>
                                                <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>Shipping</span>
                                                <span className="text-green-400 text-[10px] font-bold">FREE</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                            <span className="text-xs font-bold uppercase text-gray-500">Total</span>
                                            <span className="text-3xl font-bold tracking-tighter">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List - Flat Table */}
                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items List</h3>
                                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                                        {selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'ITEM' : 'ITEMS'}
                                    </span>
                                </div>
                                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">
                                                    QTY: {item.quantity} • SHADE: {item.variantName}
                                                </p>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900 pr-2">
                                                ₹{item.price.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
