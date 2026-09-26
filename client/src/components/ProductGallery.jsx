import React, { useState } from 'react';

export default function ProductGallery({ images = [], name = 'Product image' }) {
  const displayImages = images.length > 0
    ? images
    : ['/assets/images/hero_noir_men_1790217929182.jpg'];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0">
          {displayImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIndex === index
                  ? 'border-[#1A1A1A] ring-2 ring-stone-900/10'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 aspect-3/4 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 relative shadow-sm">
        <img
          src={displayImages[activeIndex] || displayImages[0]}
          alt={name}
          className="w-full h-full object-cover object-top transition-transform duration-500"
        />
      </div>
    </div>
  );
}
