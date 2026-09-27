import React, { useState } from 'react';

export default function ProductGallery({ images = [], name }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden bg-neutral-100 border-2 transition-all shrink-0 ${
                activeIndex === idx
                  ? 'border-neutral-900 shadow-sm'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-[3/4] bg-[#F5F4F0] rounded-lg overflow-hidden border border-neutral-200">
        <img
          src={currentImage}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Floating image counter indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded tabular-nums">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
