import React from 'react';

export default function SizeSelector({ sizes = [], selectedSize, onSelectSize }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
          Select Size
        </label>
        <span className="text-xs text-stone-500">
          Selected: <strong className="text-stone-900">{selectedSize || sizes[0]}</strong>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => {
          const isSelected = (selectedSize || sizes[0]) === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`min-w-10 h-10 px-3 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white shadow-sm ring-2 ring-[#1A1A1A] ring-offset-2'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
