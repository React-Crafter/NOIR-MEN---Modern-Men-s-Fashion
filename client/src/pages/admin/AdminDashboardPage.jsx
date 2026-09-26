import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Trash2,
  Search,
  LogOut,
  RefreshCw,
  Eye,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import DatabaseStatusBanner from '../../components/DatabaseStatusBanner.jsx';
import {
  fetchOrders,
  fetchProducts,
  updateOrderStatus,
  createProduct,
  deleteProduct,
  fetchAdminStats
} from '../../services/api.js';

export default function AdminDashboardPage() {
  const { adminUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    category: 'Panjabi',
    price: '',
    previousPrice: '',
    description: '',
    fabric: '',
    fit: '',
    stock: 20
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordList, prodList, statData] = await Promise.all([
        fetchOrders({ status: orderStatusFilter, search: orderSearch }),
        fetchProducts(),
        fetchAdminStats()
      ]);
      setOrders(ordList);
      setProducts(prodList);
      setStats(statData.stats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, orderStatusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)
      );
      // reload stats
      const statData = await fetchAdminStats();
      setStats(statData.stats);
    } catch (err) {
      alert(`Could not update order status: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this garment from the store catalog?')) {
      try {
        await deleteProduct(id);
        setProducts(prev => prev.filter(p => p.customId !== id && p._id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductData.name || !newProductData.price) return;

    try {
      const created = await createProduct({
        ...newProductData,
        price: Number(newProductData.price),
        previousPrice: newProductData.previousPrice ? Number(newProductData.previousPrice) : 0,
        stock: Number(newProductData.stock) || 10,
        images: ['/assets/images/category_panjabi_1790217944904.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Onyx Black', hex: '#111111' }, { name: 'White', hex: '#FFFFFF' }]
      });

      setProducts(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewProductData({
        name: '',
        category: 'Panjabi',
        price: '',
        previousPrice: '',
        description: '',
        fabric: '',
        fit: '',
        stock: 20
      });
      alert('Product created successfully!');
    } catch (err) {
      alert(`Failed to create product: ${err.message}`);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F4F3EF] pb-16">
      {/* Database connection notification */}
      <DatabaseStatusBanner />

      {/* Top Navigation */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-extrabold font-heading text-lg text-neutral-900 tracking-tight">
              NOIR MEN <span className="text-neutral-400 font-light text-sm">Manager</span>
            </span>
            <span className="hidden sm:inline text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200 font-medium">
              Role: {adminUser?.role || 'Admin'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 font-semibold"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={logout}
              className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1.5 font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Total Orders</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                {stats?.totalOrders ?? orders.length}
              </span>
              <Package className="w-5 h-5 text-neutral-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-amber-600 font-semibold block">Pending Dispatch</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-amber-700">
                {stats?.pendingOrders ?? orders.filter(o => o.status === 'Pending').length}
              </span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-semibold block">Delivered Orders</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-emerald-700">
                {stats?.deliveredOrders ?? orders.filter(o => o.status === 'Delivered').length}
              </span>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Catalog Styles</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                {stats?.totalProducts ?? products.length}
              </span>
              <ShoppingBag className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
              }`}
            >
              Order Consignments ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
              }`}
            >
              Catalog Inventory ({products.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#111111] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden space-y-4 p-5">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-3 border-b border-neutral-100">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer, district..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
                />
              </form>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 font-medium">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-2.5 py-1.5 font-semibold text-neutral-800 bg-white cursor-pointer focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={loadData}
                  className="p-2 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100"
                  title="Refresh orders"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">COD Total</th>
                    <th className="py-3 px-4">Status & Action</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-neutral-400">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-neutral-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                          <Link to={`/track-order?orderId=${ord.orderId}`} target="_blank" className="hover:underline flex items-center gap-1">
                            <span>{ord.orderId}</span>
                            <Eye className="w-3 h-3 text-neutral-400" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-neutral-900 block font-semibold">{ord.customerName}</strong>
                          <span className="text-neutral-500">{ord.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700">
                          {ord.district}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600">
                          {ord.products?.length || 0} item(s)
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-neutral-900">
                          ৳{ord.total?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-md border cursor-pointer ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.status === 'Cancelled'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Garment Catalog ({products.length} Products)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Retail Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Sizes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr key={p.customId || p._id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/assets/images/category_panjabi_1790217944904.jpg'}
                          alt={p.name}
                          className="w-10 h-14 object-cover rounded-md border"
                        />
                        <div>
                          <strong className="text-neutral-900 block font-semibold">{p.name}</strong>
                          <span className="text-neutral-400 font-mono text-[10px]">{p.customId}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-neutral-700">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-neutral-900">৳{p.price.toLocaleString()}</td>
                      <td className="py-3 px-4 text-neutral-600">{p.stock ?? 15} units</td>
                      <td className="py-3 px-4 text-neutral-500">{p.sizes?.join(', ')}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.customId || p._id)}
                          className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <h3 className="font-heading font-bold text-base text-neutral-900">Add New Garment to Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Bengal Silk Panjabi"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white font-medium"
                  >
                    <option value="Panjabi">Panjabi</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Pants">Pants</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Price (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    placeholder="100% Combed Cotton"
                    value={newProductData.fabric}
                    onChange={(e) => setNewProductData({ ...newProductData, fabric: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProductData.stock}
                    onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Tailored description..."
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-black text-white font-bold py-3 rounded-xl transition-all"
              >
                Publish to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
