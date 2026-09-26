import React from 'react';
import ProductCard from './ProductCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function ProductGrid({ products = [], loading = false, emptyMessage = 'No products found matching your criteria.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl border border-stone-200/60 p-4">
            <div className="aspect-3/4 bg-stone-200 rounded-xl mb-3" />
            <div className="h-3 bg-stone-200 rounded-sm w-1/3 mb-2" />
            <div className="h-4 bg-stone-200 rounded-sm w-3/4 mb-3" />
            <div className="h-4 bg-stone-200 rounded-sm w-1/2 mb-4" />
            <div className="h-9 bg-stone-200 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard key={product._id || product.customId} product={product} />
      ))}
    </div>
  );
}
