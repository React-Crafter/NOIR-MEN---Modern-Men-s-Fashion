import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import SortDropdown from '../components/SortDropdown.jsx';
import { CATEGORIES } from '../data/categories.js';

export default function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOption, setSortOption] = useState(sortParam);
  const [maxPrice, setMaxPrice] = useState(5000);

  // Sync category param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
    searchParams.set('sort', newSort);
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSortOption('featured');
    setMaxPrice(5000);
    setSearchParams({});
  };

  // Filter and sort products
  let filteredProducts = products.filter(product => {
    // Category match
    if (selectedCategory !== 'all') {
      const match = product.categorySlug === selectedCategory ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!match) return false;
    }
    // Price match
    if (product.price > maxPrice) return false;

    return true;
  });

  // Sort
  filteredProducts.sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    if (sortOption === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sortOption === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    // default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const activeCategoryObj = CATEGORIES.find(c => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-stone-200">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-500 mb-1 block">
          Catalog
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-stone-900 font-serif tracking-tight mb-3">
          {activeCategoryObj ? activeCategoryObj.name : 'All Collections'}
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl font-light">
          {activeCategoryObj
            ? activeCategoryObj.description
            : 'Explore our complete catalog of precision-cut menswear made with genuine natural fibers and Cash on Delivery across Bangladesh.'}
        </p>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          priceRange={maxPrice}
          onPriceChange={setMaxPrice}
          onReset={handleResetFilters}
        />

        {/* Content Area */}
        <div className="flex-1 w-full">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200/60">
            <span className="text-xs font-semibold text-stone-600">
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items
            </span>
            <SortDropdown value={sortOption} onChange={handleSortChange} />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            emptyMessage="No products match your selected category or price filter."
          />
        </div>
      </div>
    </div>
  );
}
