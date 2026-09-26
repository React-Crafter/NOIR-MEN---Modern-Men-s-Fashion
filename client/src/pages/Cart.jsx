import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import CartItem from '../components/CartItem.jsx';
import CartSummary from '../components/CartSummary.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, cartSubtotal, clearCart } = useProducts();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="Looks like you haven't added any garments to your bag yet. Browse our signature collections."
          actionText="Explore Collections"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-500 mb-1 block">
            Review Selection
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 font-serif tracking-tight">
            Shopping Bag
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          <span>Empty Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs divide-y divide-stone-100">
          {cart.map(item => (
            <CartItem key={item.key} item={item} />
          ))}

          <div className="pt-6 mt-4 flex items-center justify-between">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={cartSubtotal}
            deliveryCharge={60}
            showCheckoutButton={true}
            onCheckout={() => navigate('/checkout')}
            district="Dhaka"
          />
        </div>
      </div>
    </div>
  );
}
