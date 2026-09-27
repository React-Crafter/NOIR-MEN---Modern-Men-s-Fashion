import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="Explore our latest collections of handcrafted Panjabi, tailored shirts, and minimalist streetwear."
          actionText="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 mb-8 gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review your items ({totalItems} {totalItems === 1 ? 'item' : 'items'}) before proceeding to checkout
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-neutral-400 hover:text-red-600 underline transition-colors"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Main Grid: Item List (7 cols) + Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-neutral-200 p-4 sm:p-6 divide-y divide-neutral-100">
          <div className="hidden sm:grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-neutral-400 pb-3 border-b border-neutral-100">
            <span className="col-span-7">Product</span>
            <span className="col-span-3 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {items.map(item => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-5 sticky top-24">
          <CartSummary onProceedCheckout={() => navigate('/checkout')} />

          {/* Bangladeshi trust banner */}
          <div className="mt-4 p-4 rounded-lg bg-neutral-100/70 border border-neutral-200/80 text-xs text-neutral-600 space-y-2">
            <div className="flex items-center gap-2 text-neutral-800 font-semibold">
              <Truck className="w-4 h-4" />
              <span>Bangladeshi Delivery Assurance</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              Orders placed before 2:00 PM are dispatched on the same day via RedX/Steadfast/Pathao courier. You can open and verify the parcel before handing cash to the courier representative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
