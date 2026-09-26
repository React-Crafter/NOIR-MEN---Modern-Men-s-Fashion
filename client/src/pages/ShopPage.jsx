import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts } from '../services/api.js';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProducts({
          category: categoryParam,
          search: searchParam,
          sort: sortParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice);
    else next.delete('minPrice');

    if (maxPrice) next.set('maxPrice', maxPrice);
    else next.delete('maxPrice');

    setSearchParams(next);
    setIsFilterDrawerOpen(false);
  };

  const handleClearAll = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const categories = [
    { label: 'All Collection', value: 'all' },
    { label: 'Panjabi', value: 'panjabi' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Shirts', value: 'shirts' },
    { label: 'Pants & Chinos', value: 'pants' }
  ];

  const hasActiveFilters = Boolean(
    (categoryParam && categoryParam !== 'all') ||
    searchParam ||
    minPriceParam ||
    maxPriceParam
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Catalog & Wardrobe
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 mt-1">
            {categoryParam === 'all'
              ? 'Complete Collection'
              : `${categories.find((c) => c.value === categoryParam)?.label || 'Collection'}`}
          </h1>
          {searchParam && (
            <p className="text-sm text-neutral-600 mt-1">
              Showing results matching "<strong className="text-black">{searchParam}</strong>"
            </p>
          )}
        </div>

        {/* Sort & Filter controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-neutral-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-black inline-block" />
            )}
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 shadow-sm text-xs">
            <span className="text-neutral-500 font-medium">Sort:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent font-semibold text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Drops</option>
              <option value="popular">Most Popular</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = (categoryParam === 'all' && cat.value === 'all') || categoryParam === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => updateParam('category', cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-white shadow-md'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-black hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Main Grid + Desktop Filter Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block bg-white p-5 rounded-2xl border border-neutral-200 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Refine Search
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-[11px] text-neutral-500 hover:text-black font-semibold underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <form onSubmit={handleApplyPriceFilter} className="space-y-3">
            <span className="text-xs font-bold text-neutral-700 block">Price Range (BDT ৳)</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="৳500"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="৳5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#111111] text-white text-xs font-semibold py-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Apply Filter
            </button>
          </form>

          {/* Shopping Assurances */}
          <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Free delivery on ৳3,000+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Full Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>7-Day size exchange</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center text-xs text-neutral-500 mb-4">
            <span>
              Showing <strong className="text-neutral-900">{products.length}</strong> items
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[3/4] bg-neutral-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4">
              <p className="text-lg font-bold font-heading text-neutral-800">
                No products found matching your criteria
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try clearing your search filters or browse other categories like Panjabi or Heavyweight Tees.
              </p>
              <button
                onClick={handleClearAll}
                className="bg-[#111111] text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.customId || product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
