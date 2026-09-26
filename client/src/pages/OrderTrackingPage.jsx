import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle } from 'lucide-react';
import { fetchOrderById } from '../services/api.js';

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('orderId') || '';

  const [inputVal, setInputVal] = useState(queryParam);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (query) => {
    if (!query || !query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await fetchOrderById(query.trim());
      setOrder(data);
      if (!data) {
        setError('No order found matching this reference. Please check your Order ID or Phone number.');
      }
    } catch (err) {
      setError('Could not retrieve order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ orderId: inputVal.trim() });
    performSearch(inputVal);
  };

  const steps = [
    { key: 'Pending', label: 'Order Received', desc: 'Order placed by customer' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Verified by atelier dispatch' },
    { key: 'Processing', label: 'Quality Packaged', desc: 'Garment steamed & tagged' },
    { key: 'Shipped', label: 'In Transit', desc: 'Handed to courier partner' },
    { key: 'Delivered', label: 'Delivered', desc: 'Payment received at doorstep' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Delivery Logistics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900">
          Track Your Consignment
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Enter your unique NOIR MEN Order ID (e.g. <code>NM-20260924-8142</code>) or the mobile phone number used during checkout.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleFormSubmit} className="pt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. NM-20260924-8142 or 017XXXXXXXX"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center gap-3 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Tracking Card */}
      {order && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-100 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Consignment ID</span>
              <h2 className="text-xl font-bold font-mono text-neutral-900 mt-0.5">{order.orderId}</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'Cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Current Status: {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.status !== 'Cancelled' ? (
            <div className="py-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
                {steps.map((st, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={st.key} className="flex flex-col items-center text-center space-y-2 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-black text-white shadow-md'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-bold ${isCurrent ? 'text-black' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'}`}>
                        {st.label}
                      </span>
                      <p className="text-[10px] text-neutral-400 hidden sm:block max-w-[120px]">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl text-xs text-center font-medium">
              This order has been cancelled. For inquiries please contact customer concierge.
            </div>
          )}

          {/* Consignment Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#FAF9F6] rounded-xl text-xs border border-neutral-200/80">
            <div>
              <span className="text-neutral-400 block mb-0.5">Recipient:</span>
              <strong className="text-neutral-900 block font-semibold">{order.customerName}</strong>
              <span className="text-neutral-600">{order.phone}</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5">Shipping Destination:</span>
              <strong className="text-neutral-900 block font-semibold">{order.district}</strong>
              <span className="text-neutral-600 truncate block">{order.address}</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5">COD Payable:</span>
              <strong className="text-lg font-bold text-neutral-900 block">৳{order.total?.toLocaleString()}</strong>
              <span className="text-emerald-700 font-medium">Pay upon parcel inspection</span>
            </div>
          </div>

          {/* Items in Consignment */}
          {order.products && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">Garments in this parcel</h3>
              <div className="divide-y divide-neutral-100">
                {order.products.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-14 object-cover rounded-md border" />
                      <div>
                        <strong className="text-neutral-900 block font-semibold">{item.name}</strong>
                        <span className="text-neutral-500 text-[11px]">Size: {item.size} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
