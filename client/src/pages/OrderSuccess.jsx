import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Truck, PhoneCall, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice.js';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-xs animate-in zoom-in-75">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs uppercase tracking-[0.25em] font-bold text-stone-500 mb-2 block">
        Order Placed Successfully
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-serif tracking-tight mb-4">
        Thank You for Choosing NOIR MEN.
      </h1>
      <p className="text-sm text-stone-600 max-w-lg mx-auto mb-8 font-light">
        Your order has been recorded. Our concierge team will review your order details and hand over your parcel for delivery.
      </p>

      {/* Order Info Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs text-left max-w-xl mx-auto mb-8 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-xs font-semibold text-stone-500">Order Reference Number:</span>
          <span className="text-sm font-black text-stone-900 font-mono tracking-wider">
            {order?.orderId || id}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-xs">
          <span className="text-stone-500">Payment Method:</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Cash on Delivery (COD)
          </span>
        </div>

        {order?.total && (
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-xs">
            <span className="text-stone-500">Total Payable Amount:</span>
            <span className="text-base font-extrabold text-stone-900">
              {formatPrice(order.total)}
            </span>
          </div>
        )}

        {order?.customerName && (
          <div className="text-xs space-y-1 pt-1 text-stone-600">
            <p><strong>Deliver to:</strong> {order.customerName} ({order.phone})</p>
            <p><strong>Address:</strong> {order.address}, {order.district}</p>
          </div>
        )}

        <div className="p-3 bg-stone-50 rounded-xl flex items-center gap-3 text-xs text-stone-600">
          <Truck className="w-5 h-5 text-stone-500 shrink-0" />
          <span>
            Estimated delivery within 24-48 hours inside Dhaka, or 3-5 business days outside Dhaka.
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-sm"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
