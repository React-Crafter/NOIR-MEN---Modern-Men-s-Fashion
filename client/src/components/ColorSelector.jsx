import React from 'react';
import { Check } from 'lucide-react';

export default function ColorSelector({ colors = [], selectedColor, onSelectColor }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-neutral-600 mb-2.5">
        <span className="font-medium text-neutral-900">Color:</span>
        <span className="text-neutral-500">{selectedColor?.name}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {colors.map(color => {
          const isSelected = selectedColor?.name === color.name;
          const isLight = color.hex?.toLowerCase() === '#ffffff' || color.hex?.toLowerCase() === '#fafafa' || color.hex?.toLowerCase() === '#ece7dc';

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color)}
              title={color.name}
              className={`group relative w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-neutral-900 border-transparent'
                  : 'border-neutral-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select color ${color.name}`}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 ${isLight ? 'text-neutral-900' : 'text-white'}`}
                  strokeWidth={2.5}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
