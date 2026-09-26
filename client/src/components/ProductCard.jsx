import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const primaryImage = product.images?.[0] || '/assets/images/category_panjabi_1790217944904.jpg';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0] || { name: 'Standard', hex: '#111111' };
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-neutral-400">
      {/* Image Container with Badges */}
      <Link to={`/product/${product.customId || product._id}`} className="relative aspect-[3/4] bg-neutral-100 overflow-hidden block">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              {product.discount}% Off
            </span>
          )}
        </div>

        {/* Quick Add overlay button */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md text-black font-semibold text-xs py-2.5 rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
          title="Quick add to bag"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Color chips */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
          <span className="uppercase tracking-wider font-semibold text-[11px] text-neutral-400">
            {product.category}
          </span>
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-neutral-400">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Name */}
        <Link to={`/product/${product.customId || product._id}`} className="block">
          <h3 className="font-heading font-bold text-sm sm:text-base text-neutral-900 group-hover:text-black line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Fabric hint */}
        {product.fabric && (
          <p className="text-xs text-neutral-500 mt-1 line-clamp-1 font-light">
            {product.fabric}
          </p>
        )}

        {/* Price & Stock */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
            {product.previousPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.previousPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
            COD In BD
          </span>
        </div>
      </div>
    </div>
  );
}
