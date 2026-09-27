import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Eye, RefreshCw, X, Check, AlertCircle, Phone, Mail, MapPin, Truck, Calendar, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected order for detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery.trim() || undefined
      });
      if (res.success) {
        setOrders(res.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Could not load orders from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    const newParams = new URLSearchParams(searchParams);
    if (status === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', status);
    }
    setSearchParams(newParams);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;
    const targetId = selectedOrder.orderId || selectedOrder._id;
    setUpdatingStatus(true);
    setStatusMessage('');

    try {
      const res = await api.updateOrderStatus(targetId, newStatus);
      if (res.success && res.data) {
        setSelectedOrder(res.data);
        setOrders(prev =>
          prev.map(o => (o.orderId === targetId || o._id === targetId ? res.data : o))
        );
        setStatusMessage(`Order status updated to "${newStatus}"`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status in MongoDB');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Order Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Process customer orders, update delivery milestones, and inspect invoices
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-semibold rounded shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
              statusFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Orders
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleFilterChange(status)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, Phone, or District..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-900">No orders found</p>
            <p className="text-xs text-neutral-500 mt-1">
              There are currently no orders matching your status or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Delivery Destination</th>
                  <th className="py-3 px-4 font-semibold">Total (BDT)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {orders.map((order) => {
                  const dateFormatted = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A';

                  return (
                    <tr key={order.orderId || order._id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        {order.orderId}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 text-[11px] whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{order.customerName}</div>
                        <div className="text-[11px] text-neutral-500">{order.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-900">{order.district}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[150px]">
                          {order.area || order.address}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900 tabular-nums">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-semibold text-[11px] transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-6">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-mono text-neutral-900">
                    Order #{selectedOrder.orderId}
                  </h2>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Placed on{' '}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-neutral-700">
              {/* Status Update Banner */}
              <div className="p-3.5 bg-neutral-100 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-neutral-900 block text-xs">
                    Update Order Status in Database:
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Change status to automatically update order tracking in MongoDB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updatingStatus}
                    className="px-3 py-1.5 bg-white border border-neutral-300 rounded font-semibold text-xs focus:outline-none focus:border-neutral-900 cursor-pointer disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {statusMessage && (
                    <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {statusMessage}
                    </span>
                  )}
                </div>
              </div>

              {/* Grid: Customer Details & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Info */}
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-bold uppercase tracking-wider text-[11px] text-neutral-500 mb-3">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">Name:</span>
                      <span className="font-semibold text-neutral-900">{selectedOrder.customerName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">Phone:</span>
                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="font-mono font-semibold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {selectedOrder.phone}
                      </a>
                    </div>
                    {selectedOrder.email && (
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Email:</span>
                        <a
                          href={`mailto:${selectedOrder.email}`}
                          className="text-neutral-800 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-neutral-400" />
                          {selectedOrder.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-bold uppercase tracking-wider text-[11px] text-neutral-500 mb-3">
                    Delivery Address (Bangladesh)
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">District & Area:</span>
                      <span className="font-semibold text-neutral-900">
                        {selectedOrder.district} {selectedOrder.area ? `· ${selectedOrder.area}` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">Full Address:</span>
                      <span className="text-neutral-800 leading-relaxed block">
                        {selectedOrder.address}
                      </span>
                    </div>
                    {selectedOrder.notes && (
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Delivery Notes:</span>
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block font-medium">
                          "{selectedOrder.notes}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-neutral-500 mb-3">
                  Ordered Garments ({selectedOrder.products?.length || 0} items)
                </h3>
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Item</th>
                        <th className="py-2.5 px-3 font-semibold">Variant</th>
                        <th className="py-2.5 px-3 font-semibold">Unit Price</th>
                        <th className="py-2.5 px-3 font-semibold">Qty</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {(selectedOrder.products || []).map((item, idx) => {
                        const img = item.image || '/assets/images/category_panjabi_1790217944904.jpg';
                        const itemSub = Number(item.price) * (Number(item.quantity) || 1);
                        return (
                          <tr key={idx} className="hover:bg-neutral-50/50">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={img}
                                  alt={item.name}
                                  className="w-10 h-12 object-cover rounded border border-neutral-200 bg-neutral-100 shrink-0"
                                />
                                <span className="font-semibold text-neutral-900">{item.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="text-[11px]">
                                Size: <strong className="text-neutral-900">{item.size || 'M'}</strong>
                              </div>
                              {item.color?.name && (
                                <div className="text-[11px] flex items-center gap-1 text-neutral-500">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                                    style={{ backgroundColor: item.color.hex || '#111111' }}
                                  />
                                  <span>{item.color.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 tabular-nums">{formatPrice(item.price)}</td>
                            <td className="py-2.5 px-3 tabular-nums font-semibold">{item.quantity}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-neutral-900 tabular-nums">
                              {formatPrice(itemSub)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 max-w-sm ml-auto space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {selectedOrder.deliveryCharge === 0 ? 'Free' : formatPrice(selectedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Total Amount:</span>
                  <span className="tabular-nums text-neutral-950 font-extrabold">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
                <div className="pt-1 text-[11px] text-neutral-500 text-right">
                  Payment Method: <strong className="text-neutral-800">{selectedOrder.paymentMethod || 'Cash on Delivery'}</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded font-bold text-xs uppercase tracking-wider hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
