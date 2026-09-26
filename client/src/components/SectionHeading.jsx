import React from 'react';

export default function SectionHeading({ eyebrow, title, subtitle, centered = false }) {
  return (
    <div className={`mb-8 md:mb-12 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}>
      {eyebrow && (
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-500 mb-2 block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl md:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-stone-600 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
