import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import { fetchProductById } from '../services/api.js';
import { formatPrice } from '../utils/formatPrice.js';
import ProductGallery from '../components/ProductGallery.jsx';
import SizeSelector from '../components/SizeSelector.jsx';
import ColorSelector from '../components/ColorSelector.jsx';
import QuantitySelector from '../components/QuantitySelector.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function loadItem() {
      setLoading(true);
      const found = await fetchProductById(id);
      if (mounted) {
        setProduct(found);
        if (found) {
          setSelectedSize(found.sizes?.[0] || 'M');
          setSelectedColor(found.colors?.[0]?.name || 'Standard');
        }
        setLoading(false);
      }
    }
    loadItem();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-3/4 bg-stone-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-stone-200 w-1/4 rounded" />
            <div className="h-8 bg-stone-200 w-3/4 rounded" />
            <div className="h-6 bg-stone-200 w-1/3 rounded" />
            <div className="h-24 bg-stone-200 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Garment Not Found</h2>
        <p className="text-sm text-stone-600 mb-6">The requested item might be sold out or discontinued.</p>
        <Link
          to="/shop"
          className="bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const discountPercent = product.previousPrice && product.previousPrice > product.price
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const relatedProducts = products
    .filter(p => p.categorySlug === product.categorySlug && (p._id !== product._id && p.customId !== product.customId))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 font-medium">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
        {/* Left: Gallery */}
        <ProductGallery images={product.images || []} name={product.name} />

        {/* Right: Specifications & Checkout Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-bold text-stone-500">
                {product.category}
              </span>
              {product.isNew && (
                <span className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  New Arrival
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 font-serif tracking-tight leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-black text-stone-950">
                {formatPrice(product.price)}
              </span>
              {product.previousPrice && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(product.previousPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span>✓ In Stock</span>
              {product.stock <= 5 && (
                <span className="text-amber-700 font-bold">({product.stock} units remaining)</span>
              )}
            </p>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed font-light border-y border-stone-200/80 py-4">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
          )}

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Quantity:
              </label>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
                max={product.stock || 20}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-900 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                Buy Now (COD)
              </button>
            </div>
          </div>

          {/* Fabric & Care Specs */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
              Garment Specifications
            </h4>
            {product.fabric && (
              <div className="flex gap-2 text-stone-700">
                <span className="font-semibold text-stone-900 w-24 shrink-0">Fabric Composition:</span>
                <span>{product.fabric}</span>
              </div>
            )}
            {product.fit && (
              <div className="flex gap-2 text-stone-700">
                <span className="font-semibold text-stone-900 w-24 shrink-0">Cut & Fit:</span>
                <span>{product.fit}</span>
              </div>
            )}
            {product.careInstructions && (
              <div className="flex gap-2 text-stone-700">
                <span className="font-semibold text-stone-900 w-24 shrink-0">Care Advice:</span>
                <span>{product.careInstructions}</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-stone-600">
            <div className="p-3 bg-white rounded-xl border border-stone-200/60 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-stone-700" />
              <span className="font-bold text-stone-900">COD Available</span>
              <span className="text-[10px] text-stone-500">All 64 districts</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/60 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-stone-700" />
              <span className="font-bold text-stone-900">7-Day Exchange</span>
              <span className="text-[10px] text-stone-500">Doorstep pickup</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/60 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-stone-700" />
              <span className="font-bold text-stone-900">100% Genuine</span>
              <span className="text-[10px] text-stone-500">Handloom & Cotton</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-stone-200">
          <h3 className="text-2xl font-black text-stone-900 font-serif tracking-tight mb-8">
            Complete Your Look
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel._id || rel.customId} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
