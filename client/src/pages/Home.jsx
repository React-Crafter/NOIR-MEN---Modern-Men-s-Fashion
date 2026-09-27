import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, RefreshCw, Award } from 'lucide-react';
import heroImg from '../assets/images/hero_noir_men_1790217929182.jpg';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import SectionHeading from '../components/SectionHeading';

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-neutral-900 text-white overflow-hidden min-h-[580px] lg:min-h-[680px] flex items-center">
        {/* Background Image with subtle overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="NOIR MEN Editorial Campaign"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center sm:object-right opacity-60 scale-100 transition-transform duration-1000"
          />
          {/* Measured Scrim for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/75 to-transparent sm:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
          <div className="max-w-xl">
            <span className="inline-block text-xs uppercase tracking-widest text-neutral-300 font-semibold mb-3">
              Dhaka · Autumn / Winter 2026 Collection
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight sm:leading-none"
              style={{ fontFamily: "'Syne', sans-serif", textWrap: 'balance' }}
            >
              Modern Men's Fashion
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 mb-8 font-light leading-relaxed max-w-lg">
              Elevate your everyday style with timeless essentials designed for the modern man. Handcrafted Panjabi, tailored shirts, and premium heavyweight streetwear.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="px-7 py-3.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded text-center hover:bg-neutral-100 transition-colors shadow-lg shadow-black/20"
              >
                Shop Collection
              </Link>
              <Link
                to="/shop?sort=newest"
                className="px-7 py-3.5 bg-transparent border border-white/60 text-white text-xs font-bold uppercase tracking-wider rounded text-center hover:bg-white hover:text-neutral-950 transition-colors"
              >
                Explore New Arrivals
              </Link>
            </div>

            {/* Micro trust markers */}
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-6 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Cash on Delivery Nationwide
              </span>
              <span>·</span>
              <span>7-Day Return Policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Curated Categories"
          title="Designed for Every Occasion"
          subtitle="Explore distinct collections tailored for Bangladeshi climate, festivities, and daily city life."
          linkText="View All Collections"
          linkHref="/shop"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Handpicked By Stylists"
          title="Featured Essentials"
          subtitle="Signature bestsellers built on meticulous tailoring, premium fibers, and understated details."
          linkText="Browse All"
          linkHref="/shop"
        />

        <ProductGrid products={featuredProducts} columns={4} />
      </section>

      {/* 4. Brand Fabric Story / Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-neutral-800">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2 block">
              Craftsmanship & Heritage
            </span>
            <h2
              className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4"
              style={{ fontFamily: "'Syne', sans-serif", textWrap: 'balance' }}
            >
              Tailored for Bangladesh, Inspired by Global Simplicity
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-8">
              At NOIR MEN, we believe menswear should endure season after season. We source breathable Egyptian cotton, long-staple flax linen, and artisanal jacquard weaves designed specifically for Dhaka’s dynamic climate. Each garment is engineered with comfort collars, reinforced seams, and modern tapered fits.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-800 pt-6">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">260+</span>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">GSM Combed Cotton</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">64</span>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Districts Delivered</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">100%</span>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Just Dropped"
          title="New Arrivals"
          subtitle="The latest silhouettes in ceremonial Panjabi, relaxed tees, and tailored workwear."
          linkText="Shop Newest"
          linkHref="/shop?sort=newest"
        />

        <ProductGrid products={newArrivals} columns={4} />
      </section>

      {/* 6. Why Choose Us (Trust-Focused Benefits) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-100/80 rounded-xl p-8 sm:p-12 border border-neutral-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              Why Shop With NOIR MEN
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Confidence, convenience, and craftsmanship in every order across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg border border-neutral-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                <Award className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm mb-1">Premium Quality</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Hand-inspected fabrics, zero-pucker stitching, and high-density long staple fibers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm mb-1">Fast Delivery</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                24 to 48 hours within Dhaka metropolitan; 2 to 3 days for all other 63 districts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                <RefreshCw className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm mb-1">Easy Returns</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Hassle-free 7-day doorstep size replacement and color exchanges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                <Shield className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm mb-1">Secure Shopping</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Verify parcel with courier and pay cash on delivery. 100% risk-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Strong Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-neutral-950 text-white overflow-hidden py-16 px-6 sm:px-12 text-center border border-neutral-900">
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2 block">
              Upgrade Your Wardrobe Today
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Find Your Style
            </h2>
            <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto font-light leading-relaxed">
              Experience the luxury of tailored Panjabi, shirts, and everyday essentials delivered right to your door with Cash on Delivery.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neutral-950 text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors shadow-lg"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
