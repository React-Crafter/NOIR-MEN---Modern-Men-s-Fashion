import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, fetchOrders } from '../../services/api.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { Package, ShoppingCart, Clock, CheckCircle2, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 24,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const statsRes = await getAdminStats();
        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }

        const ordersRes = await fetchOrders();
        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          setRecentOrders(ordersRes.data.slice(0, 5));
        }
      } catch (err) {
        console.warn('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time activity and orders across Bangladesh.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900">{stats.totalProducts || 24}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Live across 4 categories</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900">{stats.totalOrders || recentOrders.length}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Cash on Delivery</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.pendingOrders || 0}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Awaiting confirmation</span>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900">{formatPrice(stats.totalRevenue || 0)}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">BDT Total</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Recent Customer Orders</h3>
            <p className="text-xs text-stone-500">Latest deliveries placed via the online storefront.</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No customer orders placed yet. As users checkout, orders will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">District</th>
                  <th className="py-3.5 px-6">Items</th>
                  <th className="py-3.5 px-6">Total (৳)</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {recentOrders.map(ord => (
                  <tr key={ord.orderId || ord._id} className="hover:bg-stone-50/60">
                    <td className="py-4 px-6 font-mono font-bold text-stone-900">
                      {ord.orderId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-stone-900">{ord.customerName}</div>
                      <div className="text-[11px] text-stone-400">{ord.phone}</div>
                    </td>
                    <td className="py-4 px-6">{ord.district}</td>
                    <td className="py-4 px-6">
                      {ord.items?.length || 1} {ord.items?.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status}
                      </span>
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
