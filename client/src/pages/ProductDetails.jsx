import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Truck, ShieldCheck, RefreshCw, ChevronRight, Check } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '../utils/formatPrice';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../context/ProductContext';
import ProductGallery from '../components/ProductGallery';
import SizeSelector from '../components/SizeSelector';
import ColorSelector from '../components/ColorSelector';
import QuantitySelector from '../components/QuantitySelector';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { products, getProductById } = useProducts();

  const product = getProductById(id) || products.find(p => p.id === id || p.customId === id || p._id === id);

  // States
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('fabric'); // 'fabric' | 'fit' | 'care' | 'delivery'

  // Scroll to top and reset variant selections on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || null);
      setQuantity(1);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Product not found"
          description="The product you are looking for does not exist or has been discontinued."
          actionText="Back to Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const discountPercent = getDiscountPercentage(product.price, product.previousPrice);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  // Related products (4 products from same category or others excluding current)
  const relatedProducts = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .concat(products.filter(p => p.id !== product.id))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-neutral-900 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 sm:mb-24">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Right Column: Contiguous Purchase Module (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                {product.category}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.stock} available)
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-snug"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.previousPrice && (
                <span className="text-base text-neutral-400 line-through tabular-nums">
                  {formatPrice(product.previousPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Inclusive of all taxes · Cash on Delivery nationwide
            </p>
          </div>

          <div className="border-t border-neutral-200" />

          {/* Color Selector */}
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-900 mb-2">
              Quantity:
            </label>
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              min={1}
              max={product.stock}
            />
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 bg-neutral-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now (COD)</span>
              </button>
            </div>
          </div>

          {/* Trust Value Mini-Badges */}
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200/80 space-y-2.5 text-xs text-neutral-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
              <span><strong>Dhaka 24–48 hrs</strong> (৳70) · Outside Dhaka 2–3 days (৳130)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
              <span><strong>Cash on Delivery:</strong> Inspect package at your doorstep</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0" />
              <span><strong>7-Day Exchange:</strong> Effortless size or color swap</span>
            </div>
          </div>

          {/* Description & Specifications Tabs */}
          <div className="border-t border-neutral-200 pt-6">
            <div className="flex border-b border-neutral-200 gap-6 text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab('fabric')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'fabric'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Fabric & Specs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fit')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'fit'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Fit Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Care
              </button>
            </div>

            <div className="py-4 text-xs text-neutral-600 leading-relaxed">
              {activeTab === 'fabric' && (
                <div className="space-y-2">
                  <p className="text-neutral-800 font-medium">{product.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-xs">
                    <div>
                      <span className="text-neutral-400 block">Composition</span>
                      <span className="font-semibold text-neutral-800">{product.fabric}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Category</span>
                      <span className="font-semibold text-neutral-800">{product.category}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'fit' && (
                <div className="space-y-2">
                  <p><strong className="text-neutral-800 font-semibold">Silhouette:</strong> {product.fit}</p>
                  <p className="text-neutral-500">
                    Model is 6'0" (183cm) wearing size L. We recommend choosing your standard size for a tailored drape or sizing up for a relaxed streetwear feel.
                  </p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-1.5">
                  <p>{product.careInstructions}</p>
                  <p className="text-neutral-400 text-[11px] pt-1">
                    Care for your clothes to extend their lifecycle and preserve fiber texture.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="pt-12 border-t border-neutral-200">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1 block">
            Complete the Look
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Related Styles You May Like
          </h2>
        </div>

        <ProductGrid products={relatedProducts} columns={4} />
      </section>

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 p-3 z-30 lg:hidden flex items-center justify-between gap-3 shadow-lg">
        <div className="min-w-0">
          <span className="block text-[11px] text-neutral-500 truncate">{product.name}</span>
          <span className="text-sm font-bold text-neutral-900 tabular-nums">{formatPrice(product.price)}</span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="px-5 py-2.5 bg-neutral-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add ({selectedSize})</span>
        </button>
      </div>
    </div>
  );
}
