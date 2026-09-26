import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCw, PhoneCall, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      {/* Feature Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-xl text-neutral-200 border border-neutral-800">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm tracking-tight">Express Delivery in BD</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Dhaka within 24-48 hours. Nationwide 64 districts delivery via Pathao & Steadfast.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-xl text-neutral-200 border border-neutral-800">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm tracking-tight">100% Cash on Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Inspect your package right at your doorstep before making payment. Zero advance required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-xl text-neutral-200 border border-neutral-800">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm tracking-tight">7-Day Hassle-Free Exchange</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Need a size swap or fitting adjustment? Our customer concierge will replace it swiftly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-xl text-neutral-200 border border-neutral-800">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm tracking-tight">Personalized Concierge</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Dedicated WhatsApp styling assistance & real-time delivery support everyday 10am - 10pm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand bio */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-extrabold tracking-tighter text-white font-heading">
              NOIR <span className="text-neutral-500 font-light">MEN</span>
            </span>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Curated menswear balancing contemporary Bangladeshi heritage, artisanal tailoring, and understated luxury fabrics. Designed for everyday elevation and signature moments.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Road 71, Gulshan 2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>concierge@noirmen.com</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Wardrobe</h5>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link to="/shop?category=panjabi" className="hover:text-white transition-colors">Festive Panjabi</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-white transition-colors">Artisanal Shirts</Link></li>
              <li><Link to="/shop?category=t-shirts" className="hover:text-white transition-colors">Heavyweight Tees</Link></li>
              <li><Link to="/shop?category=pants" className="hover:text-white transition-colors">Tailored Trousers</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-white transition-colors">New Releases</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shipping & COD Rates</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Exchange & Size Guide</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Delivery Coverage */}
          <div>
            <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Delivery Policy</h5>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Standard COD inside Dhaka: ৳80. All districts outside Dhaka: ৳130. Orders over ৳3,000 qualify for completely free delivery.
            </p>
            <div className="inline-block bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 px-3 py-1.5 rounded-lg">
              Payment: Cash on Delivery (COD)
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>© {new Date().getFullYear()} NOIR MEN Atelier Bangladesh. All rights reserved.</p>
        <p className="text-neutral-500">Premium Men's Wear Demo • Dhaka</p>
      </div>
    </footer>
  );
}
