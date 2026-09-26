import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText = 'Explore Collection',
  actionLink = '/shop'
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white/60 backdrop-blur-xs rounded-2xl border border-stone-200/80 my-8">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-4">
        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 max-w-md mb-6">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 shadow-sm"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
