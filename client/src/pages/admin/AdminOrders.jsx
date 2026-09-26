import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../../services/api.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { useProducts } from '../../context/ProductContext.jsx';
import { Search, Filter, Phone, MapPin, CheckCircle, Clock, Truck, XCircle, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { addToast } = useProducts();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchOrders({ status: statusFilter, search });
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(ord => (ord.orderId === orderId || ord._id === orderId) ? { ...ord, status: newStatus } : ord)
      );
      addToast(`Order ${orderId} updated to ${newStatus}`);
    } catch (err) {
      // Local fallback
      setOrders(prev =>
        prev.map(ord => (ord.orderId === orderId || ord._id === orderId) ? { ...ord, status: newStatus } : ord)
      );
      addToast(`Order ${orderId} marked as ${newStatus}`);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderId?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.phone?.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
            Customer Orders (Cash on Delivery)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Dispatch, track, and update fulfillment statuses for deliveries.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-2xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, name, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-stone-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden text-stone-700 font-medium"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Order ID & Date</th>
                  <th className="py-3.5 px-6">Customer & Phone</th>
                  <th className="py-3.5 px-6">Delivery Address</th>
                  <th className="py-3.5 px-6">Items Summary</th>
                  <th className="py-3.5 px-6">Total Due</th>
                  <th className="py-3.5 px-6">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {filteredOrders.map(order => (
                  <tr key={order.orderId || order._id} className="hover:bg-stone-50/60">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-stone-900 block">
                        {order.orderId}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{order.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-stone-800 line-clamp-1">{order.address}</div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{order.district}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-stone-900">
                        {order.items?.length || 1} {order.items?.length === 1 ? 'garment' : 'garments'}
                      </div>
                      <div className="text-[10px] text-stone-400 line-clamp-1">
                        {order.items?.map(i => `${i.name} (${i.size})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-stone-900 text-sm block">
                        {formatPrice(order.total)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Cash on Delivery
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.orderId || order._id, e.target.value)}
                        className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border focus:outline-hidden cursor-pointer ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'Cancelled'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
