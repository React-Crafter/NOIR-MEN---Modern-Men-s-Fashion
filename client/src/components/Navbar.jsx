import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Shield, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'All Collection', path: '/shop' },
    { label: 'Panjabi', path: '/shop?category=panjabi' },
    { label: 'T-Shirts', path: '/shop?category=t-shirts' },
    { label: 'Shirts', path: '/shop?category=shirts' },
    { label: 'Pants', path: '/shop?category=pants' },
    { label: 'Track Order', path: '/track-order' }
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#111111] text-neutral-300 text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>EID & SUMMER COLLECTION '26 • FREE SHIPPING ON ORDERS OVER ৳3,000</span>
        <span className="hidden md:inline text-neutral-500">|</span>
        <span className="hidden md:inline text-neutral-400">Cash on Delivery Across 64 Districts</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-neutral-800 hover:text-black focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-neutral-800 hover:text-black focus:outline-none"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col items-start group">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#111111] font-heading flex items-center gap-1.5">
                NOIR <span className="text-neutral-400 font-light tracking-widest text-lg">MEN</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase -mt-1 font-semibold">
                Dhaka • Atelier
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => {
              const isActive = location.pathname + location.search === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-sm font-medium tracking-tight transition-colors py-1 relative ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Desktop Search Toggle */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-xs text-neutral-500 hover:text-black bg-neutral-100 hover:bg-neutral-200/70 px-3.5 py-1.5 rounded-full transition-all border border-neutral-200"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search panjabi, shirts...</span>
              <kbd className="text-[10px] bg-white text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-200">⌘K</kbd>
            </button>

            {/* Admin link */}
            <Link
              to="/admin"
              className="p-2 text-neutral-600 hover:text-black transition-colors rounded-full hover:bg-neutral-100 hidden sm:flex items-center gap-1 text-xs font-medium"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden xl:inline">Portal</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-neutral-900 bg-neutral-100 hover:bg-black hover:text-white rounded-full transition-all flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF9F6]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
            <form onSubmit={handleSearchSubmit} className="p-4 sm:p-6 flex items-center gap-3 border-b border-neutral-100">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search by product name, fabric, style (e.g., Silk Panjabi, Chino)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-base sm:text-lg focus:outline-none placeholder:text-neutral-400 text-neutral-900"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="p-4 sm:p-6 bg-neutral-50/50">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Silk Panjabi', 'Cuban Collar Shirt', 'Tech Stretch Chino', 'Waffle Knit Tee', 'Mandarin Linen'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="text-xs bg-white border border-neutral-200 hover:border-black px-3 py-1.5 rounded-full text-neutral-700 hover:text-black transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF9F6] h-full shadow-2xl flex flex-col p-6 z-10">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <span className="text-xl font-extrabold tracking-tight font-heading">NOIR MEN</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-700 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-4 flex-1 overflow-y-auto">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-neutral-800 hover:text-black py-2"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-neutral-200">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-black py-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Manager Portal
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-800">Support Hotline: +880 1700-000000</p>
              <p className="mt-1">Gulshan 2, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
