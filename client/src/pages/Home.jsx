import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext.jsx';
import { CATEGORIES } from '../data/categories.js';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

export default function Home() {
  const { products, loading } = useProducts();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[580px] md:min-h-[700px] bg-stone-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero_noir_men_1790217929182.jpg"
            alt="NOIR MEN Signature Collection"
            className="w-full h-full object-cover object-top opacity-60 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Autumn/Festive Editorial 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white font-serif tracking-tight leading-[1.08] mb-6">
              The Architecture of Modern Masculinity.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed mb-8 max-w-xl">
              Impeccably tailored Panjabis, Egyptian Giza cotton shirts, and structured trousers designed for Dhaka executives and discerning celebrations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-stone-950 hover:bg-stone-200 text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 shadow-xl"
              >
                <span>Shop All Items</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?category=panjabi"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full backdrop-blur-md transition-all duration-200"
              >
                <span>Panjabi Collection</span>
              </Link>
            </div>

            {/* Quick highlight points */}
            <div className="mt-12 pt-8 border-t border-white/15 flex flex-wrap gap-6 text-xs text-stone-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cash on Delivery across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Natural Fabrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-500 mb-1 block">
              Curated Lines
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              Essential Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-black hover:translate-x-0.5 transition-transform"
          >
            <span>Explore All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Featured / Signature Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <SectionHeading
            eyebrow="Hand-Selected"
            title="Signature Pieces"
            subtitle="Our most celebrated garments crafted with pure silk, mercerized cotton, and precision tailoring."
          />
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-black mb-6"
          >
            <span>View Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Brand Craftsmanship Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181A] rounded-3xl overflow-hidden border border-stone-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-8 sm:p-12 lg:p-16 text-white space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-400">
              Fabric Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight leading-snug">
              Every Stitch is a Commitment to Dhaka's Sartorial Standard.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              We reject synthetic poly-blends in favor of long-staple Egyptian cotton, handloom mulberry silk, and European linen that breathes through humid Dhaka weather while maintaining a crisp, architectural silhouette.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Single-needle French seams for smooth interior comfort</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom mother-of-pearl and natural horn closures</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero advance Cash on Delivery with doorstep fitting review</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white text-stone-900 hover:bg-stone-200 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-colors"
              >
                <span>Read Our Craft Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="h-full min-h-[360px] lg:min-h-[500px] relative">
            <img
              src="/assets/images/category_shirt_1790217968360.jpg"
              alt="Craftsmanship and Fabric"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <SectionHeading
            eyebrow="Just Landed"
            title="Fresh Arrivals"
            subtitle="The newest silhouettes ready for immediate nationwide dispatch."
          />
          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-black mb-6"
          >
            <span>View All New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} loading={loading} />
      </section>
    </div>
  );
}
