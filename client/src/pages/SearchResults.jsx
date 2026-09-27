import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import { Search } from 'lucide-react';

export default function SearchResults() {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const cleanQuery = query.toLowerCase().trim();

  const results = cleanQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery) ||
        p.fabric.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200 mb-8">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1 block">
          Search Results
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {query ? `Search results for "${query}"` : 'All Products'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Found <strong className="text-neutral-900 font-semibold">{results.length}</strong> matching products
        </p>
      </div>

      {results.length > 0 ? (
        <ProductGrid products={results} columns={4} />
      ) : (
        <EmptyState
          icon={Search}
          title="No products found"
          description={`We couldn't find any products matching "${query}". Try searching with another keyword such as Panjabi, T-Shirts, Oxford Shirt, or Pants.`}
          actionText="Continue Shopping"
          actionHref="/shop"
        />
      )}
    </div>
  );
}
