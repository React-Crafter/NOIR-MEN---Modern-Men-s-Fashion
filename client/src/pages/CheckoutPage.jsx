import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { BANGLADESH_DISTRICTS } from '../data/fallbackProducts.js';
import { createOrder } from '../services/api.js';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    district: 'Dhaka',
    area: '',
    address: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-neutral-900">Your bag is empty</h2>
        <p className="text-xs text-neutral-500">Add garments to your shopping bag before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block bg-[#111111] text-white text-xs font-bold px-6 py-3 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isInsideDhaka = formData.district.trim().toLowerCase() === 'dhaka';
  const deliveryCharge = subtotal >= 3000 ? 0 : isInsideDhaka ? 80 : 130;
  const grandTotal = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.customerName.trim()) {
      setError('Please provide your full name');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('Please provide a valid Bangladeshi phone number (e.g. 017XXXXXXXX)');
      return;
    }

    if (!formData.address.trim()) {
      setError('Please enter your full delivery address with House, Road, and Area');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        district: formData.district,
        area: formData.area.trim() || formData.district,
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        deliveryLocation: isInsideDhaka ? 'inside_dhaka' : 'outside_dhaka',
        deliveryCharge,
        products: cart.map((item) => ({
          id: item.customId || item.id,
          customId: item.customId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        }))
      };

      const result = await createOrder(orderPayload);
      if (result.success) {
        clearCart();
        navigate(`/order-success/${result.orderId}`, { state: { order: result.data } });
      } else {
        setError(result.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to place order. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Shopping</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Checkout & Delivery
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 mt-1">
              Cash on Delivery Details
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Zero advance payment. Pay directly to the delivery rider when your package arrives at your doorstep.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact details */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="font-heading font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-2">
                1. Customer Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    placeholder="e.g. Tanvir Ahmed"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">Rider will call this number before arrival</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Email Address <span className="text-neutral-400 font-normal">(Optional for invoice copy)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="tanvir@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="font-heading font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-2">
                2. Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black bg-white cursor-pointer font-medium"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist} {dist === 'Dhaka' ? '(Inside Dhaka - ৳80)' : '(Outside Dhaka - ৳130)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Thana / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="area"
                    placeholder="e.g. Dhanmondi, Gulshan, Agrabad"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Full Street Address & Apartment <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  name="address"
                  placeholder="House number, Flat number, Road number, Landmark..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Delivery Notes <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Please deliver after 4 PM, or leave with concierge"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Payment method selector */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
              <h3 className="font-heading font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-2">
                3. Payment Method
              </h3>
              <div className="border-2 border-black rounded-xl p-4 bg-neutral-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-4 border-black bg-white shrink-0" />
                  <div>
                    <strong className="text-xs font-bold text-neutral-900 block">
                      Cash on Delivery (COD)
                    </strong>
                    <span className="text-[11px] text-neutral-500">
                      Pay ৳{grandTotal.toLocaleString()} in cash directly to the courier agent upon receiving goods.
                    </span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-black text-white font-bold py-4 px-6 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Confirming Order...</span>
              ) : (
                <span>Confirm Order (৳{grandTotal.toLocaleString()} COD)</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 sticky top-24">
            <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-18 object-cover rounded-lg border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-neutral-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-neutral-500">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <span className="text-xs font-extrabold text-neutral-900 mt-1 block">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    <strong className="text-neutral-900">৳{deliveryCharge}</strong>
                  )}
                </span>
              </div>
              {subtotal < 3000 && (
                <p className="text-[10px] text-neutral-400">
                  Tip: Orders over ৳3,000 receive 100% Free Shipping.
                </p>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="font-heading font-bold text-base text-neutral-900">Total Payable</span>
              <span className="text-2xl font-extrabold text-neutral-900 font-heading">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>

            <div className="bg-neutral-50 rounded-xl p-3 text-[11px] text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-800">Delivery Timelines:</p>
              <p>• Inside Dhaka City: 24 - 48 Hours</p>
              <p>• Outside Dhaka & All Districts: 48 - 72 Hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
