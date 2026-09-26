import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { Search, Plus, Trash2, Tag, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const { products, setProducts, addToast } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = products.filter(p => {
    if (categoryFilter !== 'all' && p.categorySlug !== categoryFilter && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.customId && p.customId.toLowerCase().includes(q));
    }
    return true;
  });

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to remove this garment from the store?')) {
      setProducts(prev => prev.filter(p => (p._id !== productId && p.customId !== productId)));
      addToast('Garment removed from catalog', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
            Inventory & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage garment listings, retail pricing, and stock levels.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title or code..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-stone-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden text-stone-700 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="panjabi">Panjabi</option>
            <option value="shirts">Shirts</option>
            <option value="t-shirts">T-Shirts</option>
            <option value="pants">Pants & Trousers</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Sizes</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
              {filtered.map(product => (
                <tr key={product._id || product.customId} className="hover:bg-stone-50/60">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || '/assets/images/hero_noir_men_1790217929182.jpg'}
                        alt={product.name}
                        className="w-12 h-15 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/product/${product._id || product.customId}`}
                          className="font-bold text-stone-900 hover:underline line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: {product.customId || product._id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="bg-stone-100 text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-bold text-stone-900">
                    {formatPrice(product.price)}
                    {product.previousPrice && (
                      <span className="block text-[10px] text-stone-400 font-normal line-through">
                        {formatPrice(product.previousPrice)}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                      {product.sizes?.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] bg-stone-50 border border-stone-200 px-1 rounded">
                          {s}
                        </span>
                      ))}
                      {product.sizes?.length > 3 && (
                        <span className="text-[10px] text-stone-400">+{product.sizes.length - 3}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      product.stock > 10
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/product/${product._id || product.customId}`}
                        className="p-1.5 text-stone-400 hover:text-black rounded-lg hover:bg-stone-100"
                        title="View on store"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id || product.customId)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
