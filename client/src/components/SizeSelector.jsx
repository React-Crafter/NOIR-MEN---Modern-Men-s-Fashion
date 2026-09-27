import React from 'react';

export default function SizeSelector({ sizes = [], selectedSize, onSelectSize, disabledSizes = [] }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-neutral-600 mb-2.5">
        <span className="font-medium text-neutral-900">Select Size:</span>
        <span className="text-neutral-500">Selected: <strong className="text-neutral-900 font-semibold">{selectedSize}</strong></span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => {
          const isSelected = selectedSize === size;
          const isDisabled = disabledSizes.includes(size);

          return (
            <button
              key={size}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectSize(size)}
              className={`min-w-[42px] h-10 px-3 flex items-center justify-center text-xs font-medium rounded border transition-colors select-none ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:text-neutral-900'
              } ${isDisabled ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
