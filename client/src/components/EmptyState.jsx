import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageX,
  title = 'No items found',
  description = 'Try adjusting your filters or search keywords to find what you are looking for.',
  actionText = 'Continue Shopping',
  actionHref = '/shop',
  onActionClick
}) {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1.5">{title}</h3>
      <p className="text-sm text-neutral-600 mb-6">{description}</p>
      {onActionClick ? (
        <button
          onClick={onActionClick}
          className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors"
        >
          {actionText}
        </button>
      ) : (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors"
        >
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
