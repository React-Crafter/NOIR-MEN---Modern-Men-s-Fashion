import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Check,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const item = await fetchProductById(id);
        if (item) {
          setProduct(item);
          setSelectedSize(item.sizes?.[0] || 'M');
          setSelectedColor(item.colors?.[0] || { name: 'Standard', hex: '#111111' });
          setSelectedImage(0);

          // Fetch related
          const cat = item.categorySlug || item.category;
          const relatedItems = await fetchProducts({ category: cat });
          setRelated(
            relatedItems.filter((p) => p.customId !== id && p._id !== id).slice(0, 4)
          );
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">Loading garment atelier...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading">Product Not Found</h2>
        <p className="text-xs text-neutral-500">The requested garment could not be found or has been discontinued.</p>
        <Link to="/shop" className="inline-block bg-black text-white text-xs px-6 py-3 rounded-xl font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/assets/images/category_panjabi_1790217944904.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.categorySlug || product.category.toLowerCase()}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-18 h-24 sm:w-full sm:h-32 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-black shadow-md' : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Photo */}
          <div className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 relative">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Details & Purchase Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 font-mono">Style Code: {product.customId}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-5 border-b border-neutral-200">
            <span className="text-3xl font-extrabold font-heading text-neutral-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.previousPrice > product.price && (
              <span className="text-base text-neutral-400 line-through">
                ৳{product.previousPrice.toLocaleString()}
              </span>
            )}
            <span className="ml-auto text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
              In Stock & Ready to Dispatch
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-800">
                  Color: <strong className="text-black font-bold">{selectedColor?.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative p-1 rounded-full border-2 transition-all ${
                        isSelected ? 'border-black scale-105' : 'border-transparent hover:border-neutral-300'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-7 h-7 rounded-full block border border-neutral-300 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-800">
                  Select Size: <strong className="text-black font-bold">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-neutral-600 hover:text-black font-semibold flex items-center gap-1 underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart (Inches)</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-white border-black shadow-md'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-neutral-200 rounded-xl bg-white px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-3 text-neutral-600 hover:text-black font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold text-neutral-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-3 text-neutral-600 hover:text-black font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Buy Now / Express Checkout */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#111111] hover:bg-black text-white font-bold py-4 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              <span>Buy Now — Cash on Delivery</span>
            </button>
          </div>

          {/* Delivery & Security Assurances Box */}
          <div className="bg-[#FAF9F6] border border-neutral-200 rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-semibold">Swift Bangladesh Delivery</strong>
                <span className="text-neutral-500">Dhaka city within 24-48 hours (৳80). Outside Dhaka 48-72 hours (৳130). Free over ৳3,000.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-semibold">100% Cash on Delivery (COD)</strong>
                <span className="text-neutral-500">No advance payment necessary. Check parcel before payment.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-semibold">7-Day Free Fitting Exchange</strong>
                <span className="text-neutral-500">Effortless size swaps across all 64 districts.</span>
              </div>
            </div>
          </div>

          {/* Product Specifications Table */}
          <div className="border-t border-neutral-200 pt-5 space-y-3 text-xs">
            <h4 className="font-bold font-heading text-sm text-neutral-900">Garment Craftsmanship</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-neutral-600">
              <div>
                <span className="text-neutral-400 block">Fabric:</span>
                <strong className="text-neutral-800 font-medium">{product.fabric || '100% Premium Cotton'}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">Fit Profile:</span>
                <strong className="text-neutral-800 font-medium">{product.fit || 'Modern Tailored Cut'}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-400 block">Care Guide:</span>
                <p className="text-neutral-700 font-light mt-0.5">{product.careInstructions || 'Dry clean or cold machine wash delicate.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-neutral-800" />
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  {product.category} Size Chart (Inches)
                </h3>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Standard Bangladeshi atelier sizing. Measurements refer to garment dimensions in inches.
            </p>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="p-3 font-bold text-black">S (38)</td>
                    <td className="p-3">39.5"</td>
                    <td className="p-3">40.0"</td>
                    <td className="p-3">17.0"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black">M (40)</td>
                    <td className="p-3">41.5"</td>
                    <td className="p-3">42.0"</td>
                    <td className="p-3">17.5"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black">L (42)</td>
                    <td className="p-3">43.5"</td>
                    <td className="p-3">44.0"</td>
                    <td className="p-3">18.2"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black">XL (44)</td>
                    <td className="p-3">45.5"</td>
                    <td className="p-3">45.0"</td>
                    <td className="p-3">19.0"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black">XXL (46)</td>
                    <td className="p-3">47.5"</td>
                    <td className="p-3">46.0"</td>
                    <td className="p-3">19.8"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full bg-[#111111] text-white text-xs font-bold py-3 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-neutral-200">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">You May Also Like</span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 mt-1">
                More from {product.category}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item) => (
              <ProductCard key={item.customId || item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
