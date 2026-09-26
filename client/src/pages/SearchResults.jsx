import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { ChevronRight } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loading } = useProducts();

  const filtered = query.trim()
    ? products.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 font-medium">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900">Search Results</span>
      </nav>

      <div className="max-w-xl mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight mb-4">
          Results for "{query}"
        </h1>
        <SearchBar initialQuery={query} />
      </div>

      <div className="mb-6 pb-4 border-b border-stone-200">
        <p className="text-xs text-stone-600 font-semibold">
          Found <strong className="text-stone-900">{filtered.length}</strong> matching garments
        </p>
      </div>

      <ProductGrid
        products={filtered}
        loading={loading}
        emptyMessage={`No items found matching "${query}". Try searching for Panjabi, Silk, Shirt, Cotton, or Trousers.`}
      />
    </div>
  );
}
