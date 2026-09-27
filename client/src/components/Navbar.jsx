import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Panjabi', href: '/shop?category=panjabi' },
    { name: 'Shirts', href: '/shop?category=shirts' },
    { name: 'T-Shirts', href: '/shop?category=t-shirts' },
    { name: 'Pants', href: '/shop?category=pants' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const primaryDesktopLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Panjabi', href: '/shop?category=panjabi' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname + location.search === href || (href === '/shop' && location.pathname === '/shop' && !location.search);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        {/* Subtle Top Notification Bar - Desktop / Large Devices only */}
        <div className="hidden lg:block bg-neutral-900 text-neutral-300 text-[11px] py-1.5 px-4 tracking-wide font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="truncate">Nationwide Cash on Delivery across Bangladesh · Free Delivery on orders over ৳3,000</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-400 hover:text-white transition-colors shrink-0 ml-3 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700"
            >
              Management
            </Link>
          </div>
        </div>

        {/* Strict 3-Zone Navigation Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element Brand Wordmark */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-neutral-800 hover:text-neutral-950 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              to="/"
              className="font-bold tracking-widest text-lg sm:text-xl uppercase text-neutral-950 hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              NOIR MEN
            </Link>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-700">
            {primaryDesktopLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                className={`py-1 transition-colors hover:text-neutral-950 relative ${
                  isActive(link.href) ? 'text-neutral-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Primary actions (Search & Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors flex items-center gap-1.5 text-xs"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden md:inline font-medium text-neutral-500">Search</span>
            </button>

            {/* Shopping Bag Button with Tabular Badge */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-950 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 space-y-2">
              <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 pb-1">
                Navigation
              </div>
              <div className="grid grid-cols-2 gap-1 pb-3">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                      isActive(link.href)
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Quick direct search link & Management */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 bg-neutral-50 text-neutral-700 rounded text-xs hover:bg-neutral-100"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Search all products</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">Tap to search</span>
                </button>

                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center p-2.5 bg-neutral-900 text-white rounded text-xs hover:bg-neutral-800 font-semibold transition-colors"
                >
                  Management
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
