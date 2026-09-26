import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Compass, Feather } from 'lucide-react';

export default function About() {
  return (
    <div className="py-12 md:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-stone-500">
          The Atelier Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 font-serif tracking-tight leading-tight">
          Where Artisanal Heritage Meets Contemporary Sartorial Discipline.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
          Founded in Dhaka, NOIR MEN was conceived with a single, uncompromising vision: to elevate Bangladeshi menswear into an international standard of luxury and architectural fit.
        </p>
      </div>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="aspect-16/9 rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <img
            src="/assets/images/hero_noir_men_1790217929182.jpg"
            alt="NOIR MEN Atelier"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Natural Fibers Only</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              We never use cheap synthetic blends that trap heat and pill after three washes. Every yarn is spun from authentic long-staple cotton, natural mulberry silk, and European linen.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Architectural Silhouette</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Our patterns are drafted specifically for South Asian postures—providing a structured shoulder drape, clean taper across the torso, and effortless movement in tropical climates.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Honest Commerce</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Zero advance payment Cash on Delivery across all 64 districts in Bangladesh. We believe trust is earned at the doorstep when you feel the fabric in your hands.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-[#111111] text-white rounded-3xl p-10 sm:p-14 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black font-serif">
            Experience the NOIR MEN Standard
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            Order online with full Cash on Delivery protection and door-to-door sizing exchange.
          </p>
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-stone-950 hover:bg-stone-200 text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
