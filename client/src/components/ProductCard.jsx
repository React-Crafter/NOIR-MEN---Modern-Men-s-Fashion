import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    const sizeToAdd = size || selectedSize;
    addToCart(product, sizeToAdd, product.colors[0], 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
    setShowQuickSelect(false);
  };

  const discountPercent = product.previousPrice && product.previousPrice > product.price
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white border border-neutral-200/80 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300">
      {/* Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[3/4] bg-[#F5F4F0] overflow-hidden"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Elegant fallback if an image fails
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling) {
              e.currentTarget.nextElementSibling.classList.remove('hidden');
            }
          }}
        />

        {/* Fallback container if image fails to load */}
        <div className="hidden absolute inset-0 bg-[#EFECE6] flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">
            {product.category}
          </span>
          <p className="text-sm font-medium text-neutral-700">{product.name}</p>
        </div>

        {/* Top Badges (Subtle text, no candy pill sandwich) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.isNew && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick actions desktop overlay */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
          {!showQuickSelect ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickSelect(true);
              }}
              className="w-full py-2.5 px-3 bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-semibold rounded shadow-md border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          ) : (
            <div
              className="bg-white p-2 rounded shadow-xl border border-neutral-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5 px-1">
                <span>Select Size:</span>
                <button
                  type="button"
                  onClick={() => setShowQuickSelect(false)}
                  className="text-neutral-400 hover:text-neutral-900"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleQuickAdd(e, size)}
                    className="flex-1 min-w-[28px] h-7 text-[11px] font-medium border border-neutral-200 rounded hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Category & Stock indicator */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span className="uppercase tracking-wider text-[11px] font-medium text-neutral-500">
            {product.category}
          </span>
          <span className="text-[11px] text-emerald-700">In Stock</span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="font-medium text-sm sm:text-base text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1 mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Available Sizes Hint */}
        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-3">
          <span>Sizes:</span>
          <span className="text-neutral-600 font-medium">{product.sizes.join(' · ')}</span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-neutral-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          {/* Mobile direct add button */}
          <button
            type="button"
            onClick={(e) => handleQuickAdd(e, product.sizes[0])}
            aria-label="Add to cart"
            className={`sm:hidden p-2 rounded transition-colors ${
              isAdded ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white active:scale-95'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
