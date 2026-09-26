import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchOrderById } from '../services/api.js';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      async function load() {
        try {
          const data = await fetchOrderById(orderId);
          setOrder(data);
        } catch (e) {
          console.error('Failed to load order confirmation:', e);
        } finally {
          setLoading(false);
        }
      }
      load();
    }
  }, [orderId, order]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Success Badge Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900">
          Thank you for choosing NOIR MEN
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Your order has been recorded in our dispatch atelier. Our team will prepare and dispatch your parcel promptly.
        </p>
      </div>

      {/* Order Reference Box */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-neutral-100 gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Order Reference</span>
            <strong className="text-lg font-mono font-bold text-neutral-900">{orderId}</strong>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Payment Terms</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>

        {/* Customer & Address Details */}
        {order && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-neutral-900 mb-2 uppercase tracking-wider text-[11px]">Customer & Contact</h4>
              <p className="font-semibold text-neutral-800 text-sm">{order.customerName}</p>
              <p className="text-neutral-600 mt-0.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{order.phone}</span>
              </p>
              {order.email && <p className="text-neutral-500 mt-0.5">{order.email}</p>}
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 mb-2 uppercase tracking-wider text-[11px]">Delivery Location</h4>
              <p className="font-semibold text-neutral-800">{order.address}</p>
              <p className="text-neutral-600 mt-0.5">{order.area}, {order.district}</p>
              {order.notes && (
                <p className="text-neutral-400 mt-1 italic">Note: "{order.notes}"</p>
              )}
            </div>
          </div>
        )}

        {/* Products List */}
        {order?.products && (
          <div className="space-y-3 pt-5 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Items Ordered</h4>
            <div className="divide-y divide-neutral-100">
              {order.products.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover rounded-lg border border-neutral-200"
                    />
                    <div>
                      <p className="font-bold text-neutral-900">{item.name}</p>
                      <p className="text-neutral-500 text-[11px]">
                        Size: {item.size} • Color: {item.color?.name || 'Standard'} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `৳${order.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total Amount to Pay Rider:</span>
                <span>৳{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* COD Notice */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-start gap-3 text-xs text-neutral-700">
          <Truck className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-neutral-900">What happens next?</strong>
            <span>
              Our dispatch department will contact you via phone or SMS once the package is with the courier. You only pay ৳{order?.total ? order.total.toLocaleString() : ''} upon delivery inspection.
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={`/track-order?orderId=${orderId}`}
          className="bg-white border border-neutral-300 hover:border-black text-black font-semibold text-xs py-3.5 px-6 rounded-xl text-center transition-all"
        >
          Track Order Status
        </Link>
        <Link
          to="/shop"
          className="bg-[#111111] hover:bg-black text-white font-bold text-xs py-3.5 px-8 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
