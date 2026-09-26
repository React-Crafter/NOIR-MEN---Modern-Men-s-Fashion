import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts } from '../services/api.js';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [featured, newest] = await Promise.all([
          fetchProducts({ featured: true }),
          fetchProducts({ sort: 'newest' })
        ]);
        setFeaturedProducts(featured.slice(0, 4));
        setNewArrivals(newest.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    {
      title: 'Festive Panjabi',
      subtitle: 'Silk-viscose & jacquard weaves',
      image: '/assets/images/category_panjabi_1790217944904.jpg',
      link: '/shop?category=panjabi',
      count: '6 Items'
    },
    {
      title: 'Heavyweight Tees',
      subtitle: '260 GSM compact cotton cuts',
      image: '/assets/images/category_tshirt_1790217958167.jpg',
      link: '/shop?category=t-shirts',
      count: '5 Items'
    },
    {
      title: 'Artisanal Shirts',
      subtitle: 'Mandarin collars & airy flax linen',
      image: '/assets/images/category_shirt_1790217968360.jpg',
      link: '/shop?category=shirts',
      count: '5 Items'
    },
    {
      title: 'Tailored Trousers',
      subtitle: 'Tech chinos & front-pleated cuts',
      image: '/assets/images/category_pants_1790217977864.jpg',
      link: '/shop?category=pants',
      count: '4 Items'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-[#111111] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero_noir_men_1790217929182.jpg"
            alt="NOIR MEN Editorial Campaign"
            className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-white">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-neutral-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Eid & Summer Atelier Edition 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading leading-[1.08] text-white">
              Sartorial Heritage <br />
              <span className="text-neutral-400 font-light italic">Reimagined for Today.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl">
              Elevate your daily and celebratory presence with meticulously tailored Panjabis, breathable linen shirts, and heavyweight tees. Handcrafted silhouettes shipped across Bangladesh with Cash on Delivery.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/shop"
                className="bg-white text-black hover:bg-neutral-200 font-bold px-8 py-4 rounded-xl text-center text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop All Wardrobe</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop?category=panjabi"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold px-8 py-4 rounded-xl text-center text-sm transition-all"
              >
                Explore Panjabi Edit
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md text-xs text-neutral-400">
              <div>
                <strong className="block text-white font-bold text-sm">৳0 Advance</strong>
                <span>Cash on Delivery</span>
              </div>
              <div>
                <strong className="block text-white font-bold text-sm">24-48 Hours</strong>
                <span>Dhaka City Delivery</span>
              </div>
              <div>
                <strong className="block text-white font-bold text-sm">64 Districts</strong>
                <span>Nationwide Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 mt-1">
              Curated Wardrobe Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 mt-2 md:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative h-96 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 block shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                  {cat.count}
                </span>
                <h3 className="text-xl font-bold font-heading mt-0.5 group-hover:text-amber-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 font-light line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/90">
                  <span>Explore items</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature Festive Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-700 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Festive Panjabi Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900">
              The Onyx & Jacquard Edit
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Refined tailoring, geometric placket embroidery, and breathable luxury fabrics.
            </p>
          </div>
          <Link
            to="/shop?category=panjabi"
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 mt-2 md:mt-0"
          >
            <span>See All Festive Panjabis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.customId || product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Campaign Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#171717] text-white overflow-hidden p-8 sm:p-14 border border-neutral-800">
          <div className="relative z-10 max-w-xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Fabric Engineering
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-heading leading-tight">
              Designed for Humid Dhaka Summers & Crisp Festive Evenings
            </h3>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Every garment is created with zero-compromise textile selection: 260 GSM combed cotton that won't lose shape, organic European flax linen that breathes, and Egyptian mercerized cotton with a natural silk luster.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <span>Browse Entire Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 lg:opacity-40 hidden sm:block pointer-events-none">
            <img
              src="/assets/images/category_shirt_1790217968360.jpg"
              alt="Artisanal shirt fabric detail"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Fresh Drops</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 mt-1">
              Latest Additions
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 mt-2 md:mt-0"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.customId || product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
