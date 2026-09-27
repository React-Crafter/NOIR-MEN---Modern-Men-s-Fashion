import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Trust Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-neutral-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded bg-neutral-900 text-white shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Nationwide Delivery</h5>
              <p className="text-neutral-400 mt-0.5 leading-relaxed">
                Dhaka (24–48 hrs) · Outside Dhaka (2–3 days). Free over ৳3,000.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded bg-neutral-900 text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Cash on Delivery</h5>
              <p className="text-neutral-400 mt-0.5 leading-relaxed">
                Pay in cash right at your doorstep anywhere in Bangladesh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded bg-neutral-900 text-white shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Hassle-Free Exchange</h5>
              <p className="text-neutral-400 mt-0.5 leading-relaxed">
                Easy 7-day size or color exchange support for your peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded bg-neutral-900 text-white shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Dedicated Support</h5>
              <p className="text-neutral-400 mt-0.5 leading-relaxed">
                10:00 AM – 10:00 PM everyday via Call & WhatsApp hotline.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation & Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-neutral-800">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <span
              className="text-xl font-bold tracking-widest uppercase text-white block mb-3"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              NOIR MEN
            </span>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-6 font-light">
              Modern men's fashion engineered for Bangladesh. We create refined, timeless wardrobe essentials ranging from handcrafted ceremonial Panjabi to minimalist heavyweight streetwear.
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="font-medium text-white">Follow Us:</span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <span>·</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <span>·</span>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-white tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=panjabi" className="hover:text-white transition-colors">Panjabi Collection</Link></li>
              <li><Link to="/shop?category=t-shirts" className="hover:text-white transition-colors">Heavyweight T-Shirts</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Craft</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Studio & Contact</Link></li>
              <li className="pt-1">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800"
                >
                  <span>Admin Portal</span>
                  <span className="text-[9px] uppercase px-1 py-0.2 bg-neutral-800 text-neutral-300 rounded">Demo</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-white tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/shop?category=panjabi" className="hover:text-white transition-colors">Festive Panjabi</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-white transition-colors">Linen & Oxford Shirts</Link></li>
              <li><Link to="/shop?category=t-shirts" className="hover:text-white transition-colors">Combed Cotton Tees</Link></li>
              <li><Link to="/shop?category=pants" className="hover:text-white transition-colors">Tailored Chinos & Trousers</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-white tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <span>Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="font-mono text-neutral-300">+880 1711 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>support@noirmen.com</span>
              </li>
              <li className="pt-1 text-[11px] text-neutral-500">
                Payment: Cash on Delivery (COD)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} NOIR MEN. Modern Men's Fashion. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Exchange & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
