import React from 'react';
import { CATEGORIES } from '../data/categories.js';
import { Filter, RotateCcw } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice.js';

export default function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  onReset
}) {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Filters</h3>
          </div>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1 text-[11px] font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Category
          </h4>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>All Collections</span>
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === cat.slug
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${selectedCategory === cat.slug ? 'text-stone-300' : 'text-stone-400'}`}>
                  {cat.itemCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Max Price
            </h4>
            <span className="text-xs font-bold text-stone-900">
              {formatPrice(priceRange || 5000)}
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={priceRange || 5000}
            onChange={e => onPriceChange(Number(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1">
            <span>{formatPrice(500)}</span>
            <span>{formatPrice(5000)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
