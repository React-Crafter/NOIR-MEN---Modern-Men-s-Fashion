import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, AlertCircle, Image as ImageIcon, Filter, RefreshCw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatPrice';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const CATEGORY_OPTIONS = ['Panjabi', 'T-Shirts', 'Shirts', 'Pants'];

const PRESET_IMAGES = [
  { label: 'Panjabi Look', url: '/assets/images/category_panjabi_1790217944904.jpg' },
  { label: 'T-Shirt Look', url: '/assets/images/category_tshirt_1790217958167.jpg' },
  { label: 'Shirt Look', url: '/assets/images/category_shirt_1790217968360.jpg' },
  { label: 'Pants Look', url: '/assets/images/category_pants_1790217977864.jpg' },
  { label: 'Editorial Campaign', url: '/assets/images/hero_noir_men_1790217929182.jpg' }
];

export default function AdminProducts() {
  const { products, loading, error, refreshProducts, createProduct, updateProduct, deleteProduct } = useProducts();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding
  const [isDeleting, setIsDeleting] = useState(null); // product id to delete
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Panjabi',
    price: '',
    previousPrice: '',
    stock: 15,
    images: ['/assets/images/category_panjabi_1790217944904.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#111111' }],
    description: '',
    fabric: '',
    fit: '',
    isFeatured: false,
    isNew: true
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#111111');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory || p.categorySlug === selectedCategory.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.id && p.id.toLowerCase().includes(search.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Panjabi',
      price: '',
      previousPrice: '',
      stock: 15,
      images: ['/assets/images/category_panjabi_1790217944904.jpg'],
      sizes: ['M', 'L', 'XL'],
      colors: [{ name: 'Black', hex: '#111111' }, { name: 'Navy', hex: '#1B263B' }],
      description: 'Handcrafted with refined menswear tailoring for modern occasions.',
      fabric: '100% Premium Egyptian Combed Cotton',
      fit: 'Modern Tailored Fit',
      isFeatured: false,
      isNew: true
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Panjabi',
      price: product.price || '',
      previousPrice: product.previousPrice || '',
      stock: product.stock !== undefined ? product.stock : 10,
      images: product.images && product.images.length > 0 ? [...product.images] : ['/assets/images/category_panjabi_1790217944904.jpg'],
      sizes: product.sizes && product.sizes.length > 0 ? [...product.sizes] : ['M', 'L', 'XL'],
      colors: product.colors && product.colors.length > 0 ? [...product.colors] : [{ name: 'Standard', hex: '#111111' }],
      description: product.description || '',
      fabric: product.fabric || '',
      fit: product.fit || '',
      isFeatured: Boolean(product.isFeatured),
      isNew: Boolean(product.isNew)
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleSize = (size) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      const updated = exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: updated.length > 0 ? updated : [size] };
    });
  };

  const handleAddImage = (url) => {
    const targetUrl = url || newImageUrl.trim();
    if (!targetUrl) return;
    if (!formData.images.includes(targetUrl)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, targetUrl] }));
    }
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const filtered = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: filtered.length > 0 ? filtered : ['/assets/images/category_panjabi_1790217944904.jpg'] };
    });
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => {
      const filtered = prev.colors.filter((_, i) => i !== index);
      return { ...prev, colors: filtered.length > 0 ? filtered : [{ name: 'Standard', hex: '#111111' }] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return;
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setFormError('Please enter a valid price in BDT');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        previousPrice: formData.previousPrice ? Number(formData.previousPrice) : 0,
        stock: Number(formData.stock) || 0,
        images: formData.images,
        sizes: formData.sizes,
        colors: formData.colors,
        description: formData.description.trim(),
        fabric: formData.fabric.trim(),
        fit: formData.fit.trim(),
        isFeatured: formData.isFeatured,
        isNew: formData.isNew
      };

      if (editingProduct) {
        const targetId = editingProduct.id || editingProduct.customId || editingProduct._id;
        await updateProduct(targetId, payload);
      } else {
        await createProduct(payload);
      }

      setIsModalOpen(false);
      refreshProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product in database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!isDeleting) return;
    try {
      await deleteProduct(isDeleting);
      setIsDeleting(null);
      refreshProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Product Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage catalog items, pricing, inventory stock, and color variants in MongoDB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshProducts}
            disabled={loading}
            className="p-2 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded shadow-xs transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Category:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All ({products.length})
          </button>
          {CATEGORY_OPTIONS.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-neutral-900">No products found</p>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price (BDT)</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Sizes & Colors</th>
                  <th className="py-3 px-4 font-semibold">Badges</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {filteredProducts.map((p) => {
                  const id = p.id || p.customId || p._id;
                  const img = p.images?.[0] || '/assets/images/category_panjabi_1790217944904.jpg';
                  return (
                    <tr key={id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded border border-neutral-200 bg-neutral-100 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-neutral-900 block leading-snug">
                              {p.name}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                              ID: {id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-800">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 tabular-nums">
                          {formatPrice(p.price)}
                        </span>
                        {p.previousPrice > p.price && (
                          <span className="block text-[11px] text-neutral-400 line-through tabular-nums">
                            {formatPrice(p.previousPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold tabular-nums ${
                            p.stock <= 5 ? 'text-amber-600' : 'text-neutral-700'
                          }`}
                        >
                          {p.stock} units
                        </span>
                        {p.stock <= 5 && (
                          <span className="block text-[10px] text-amber-600 font-bold uppercase">
                            Low Stock
                          </span>
                        )}
                      </td>

                      {/* Sizes & Colors */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {(p.sizes || []).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-[10px] font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          {(p.colors || []).map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3 h-3 rounded-full border border-neutral-300"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Featured
                            </span>
                          )}
                          {p.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDeleting(id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {editingProduct ? `Updating ${editingProduct.name}` : 'Create a new garment entry in MongoDB'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. The Imperial Jacquard Silk Panjabi"
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 bg-white"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Price & Previous Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Price (BDT ৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2450"
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Original Price (Optional Strike-through ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.previousPrice}
                    onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value })}
                    placeholder="2800"
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Available Sizes */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_SIZES.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  Color Options
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.colors.map((c, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-100 border border-neutral-300 rounded text-xs"
                    >
                      <span className="w-3 h-3 rounded-full border border-neutral-400" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(i)}
                        className="text-neutral-400 hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Color Name (e.g. Royal Navy)"
                    className="flex-1 px-2.5 py-1.5 border border-neutral-300 rounded text-xs focus:outline-none focus:border-neutral-900"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-neutral-300 p-0.5 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded border border-neutral-300"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Image URLs & Presets */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  Images (URLs)
                </label>

                {/* Previews */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative group border border-neutral-200 rounded overflow-hidden">
                      <img src={img} alt="preview" className="w-14 h-16 object-cover bg-neutral-100" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Presets */}
                <div className="mb-2">
                  <span className="text-[11px] text-neutral-500 block mb-1">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleAddImage(preset.url)}
                        className="px-2 py-0.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-[10px] text-neutral-600"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste custom image URL (https://... or /assets/images/...)"
                    className="flex-1 px-2.5 py-1.5 border border-neutral-300 rounded text-xs focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded border border-neutral-300"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Description & Fabric */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Product Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial garment summary..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. 100% Washed Linen"
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Garment Fit
                  </label>
                  <input
                    type="text"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="e.g. Modern Slim Fit"
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded accent-neutral-900"
                  />
                  <span className="font-semibold text-neutral-800">Featured on Home Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded accent-neutral-900"
                  />
                  <span className="font-semibold text-neutral-800">New Arrival Badge</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-neutral-900 text-white font-bold rounded uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to Database...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900">Confirm Deletion</h3>
            <p className="text-xs text-neutral-600 mt-2">
              Are you sure you want to delete this product from MongoDB? This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleting(null)}
                className="px-3 py-1.5 border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 bg-red-600 text-white rounded font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
