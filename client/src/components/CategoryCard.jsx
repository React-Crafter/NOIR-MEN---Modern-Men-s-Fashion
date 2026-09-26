import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group relative flex flex-col justify-end aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-200/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
      />

      {/* Measured Scrim for contrast as specified in skill */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 text-white flex flex-col">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-300 mb-1">
          {category.itemCount}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-white">
          {category.name}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mb-4 leading-relaxed font-light">
          {category.description}
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
          <span>Explore Collection</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
