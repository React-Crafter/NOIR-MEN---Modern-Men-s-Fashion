import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminStats();
      if (res.success) {
        setStats(res.stats || {});
        setRecentOrders(res.recentOrders || []);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load real-time database stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    <div className="space-y-8">
      {/* Top Welcome & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Store overview powered by MongoDB & Express REST API
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-semibold rounded shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Summary Cards as explicitly specified */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Total Products
            </span>
            <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">
              {stats.totalProducts}
            </span>
            <Link
              to="/admin/products"
              className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium inline-flex items-center gap-0.5 mt-2 transition-colors"
            >
              <span>Manage catalog</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">
              {stats.totalOrders}
            </span>
            <Link
              to="/admin/orders"
              className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium inline-flex items-center gap-0.5 mt-2 transition-colors"
            >
              <span>View all orders</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {stats.pendingOrders}
            </span>
            <Link
              to="/admin/orders?status=Pending"
              className="text-[11px] text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-0.5 mt-2 transition-colors"
            >
              <span>Review pending</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Delivered Orders
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {stats.deliveredOrders}
            </span>
            <Link
              to="/admin/orders?status=Delivered"
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-0.5 mt-2 transition-colors"
            >
              <span>Completed orders</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 text-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Inventory & Catalog
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Product Management
            </h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Add new garments, update prices, manage stock quantities, adjust color swatches and sizes in MongoDB.
            </p>
          </div>
          <div className="mt-5">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-900 font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors"
            >
              <span>Go to Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Order Fulfillment
            </span>
            <h3 className="text-lg font-bold text-neutral-900 mt-1">
              Customer Orders & Dispatch
            </h3>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              View incoming customer orders across Bangladesh, check delivery details, and transition statuses from Pending to Delivered.
            </p>
          </div>
          <div className="mt-5">
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Recent Orders
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Latest incoming checkout orders saved in MongoDB
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No recent orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {order.orderId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-500">{order.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{order.district}</div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                        {order.area || order.address}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-semibold text-neutral-900 hover:underline"
                      >
                        View Details
                      </Link>
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
