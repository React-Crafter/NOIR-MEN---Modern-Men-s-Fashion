import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import { createOrder } from '../services/api.js';
import { formatPrice } from '../utils/formatPrice.js';
import { ShieldCheck, Truck, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const BD_DISTRICTS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura', 'Cox\'s Bazar', 'Jashore', 'Tangail', 'Faridpur',
  'Feni', 'Brahmanbaria', 'Noakhali', 'Pabna', 'Kushtia', 'Dinajpur', 'Jamalpur'
];

export default function Checkout() {
  const { cart, cartSubtotal, clearCart, addToast } = useProducts();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">No Items to Checkout</h2>
        <p className="text-sm text-stone-600 mb-6">Your shopping bag is currently empty.</p>
        <Link
          to="/shop"
          className="bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Delivery charge calculation
  const isInsideDhaka = district.toLowerCase() === 'dhaka';
  const standardDeliveryFee = isInsideDhaka ? 60 : 120;
  const isFreeDelivery = cartSubtotal >= 5000;
  const deliveryCharge = isFreeDelivery ? 0 : standardDeliveryFee;
  const totalPayable = cartSubtotal + deliveryCharge;

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = 'Please enter your full name';
    if (!phone.trim()) {
      errs.phone = 'Please enter your mobile phone number';
    } else if (!/^01[3-9]\d{8}$/.test(phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX)';
    }
    if (!address.trim()) errs.address = 'Please provide full house/street delivery address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const orderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      district,
      notes: notes.trim(),
      paymentMethod: 'Cash on Delivery',
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      subtotal: cartSubtotal,
      deliveryCharge,
      total: totalPayable
    };

    try {
      const result = await createOrder(orderPayload);
      if (result.success && result.data) {
        clearCart();
        addToast('Order confirmed successfully!', 'success');
        navigate(`/order-success/${result.data.orderId}`, { state: { order: result.data } });
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      addToast(err.message || 'Error creating order. Please retry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-black mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-stone-900 font-serif tracking-tight">
          Cash on Delivery Checkout
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Pay with cash when your package is delivered to your doorstep. No online payment needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Details */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              1. Customer Delivery Details
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className={`w-full px-4 py-3 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-hidden transition-all ${
                  errors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-200 focus:border-stone-900'
                }`}
              />
              {errors.customerName && (
                <p className="text-[11px] text-red-500 mt-1">{errors.customerName}</p>
              )}
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mobile Number (BD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className={`w-full px-4 py-3 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-hidden transition-all ${
                    errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-200 focus:border-stone-900'
                  }`}
                />
                {errors.phone ? (
                  <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                ) : (
                  <p className="text-[10px] text-stone-400 mt-1">Our rider will call before delivery.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-900 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* District Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Delivery District <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-4 py-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-900 focus:outline-hidden transition-all cursor-pointer font-medium"
              >
                {BD_DISTRICTS.map(d => (
                  <option key={d} value={d}>
                    {d} {d === 'Dhaka' ? '(Inside Dhaka - ৳60)' : '(Outside Dhaka - ৳120)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Street Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House No, Road / Street No, Area / Thana, Landmark (e.g. House 14, Road 5, Block C, Banani, Dhaka)"
                className={`w-full px-4 py-3 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-hidden transition-all ${
                  errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-200 focus:border-stone-900'
                }`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Delivery Notes / Fitting Remarks <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Please deliver after 5:00 PM or call security"
                className="w-full px-4 py-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              2. Payment Method
            </h3>
            <div className="p-4 rounded-xl border-2 border-stone-900 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center text-white">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-stone-500">Pay cash in hand when the rider hands over your parcel.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Verified COD
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1A1A1A] hover:bg-black disabled:bg-stone-400 text-white py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <span>Confirm Order (Pay {formatPrice(totalPayable)} on Delivery)</span>
            )}
          </button>
        </form>

        {/* Order Items Review Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Items ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>

            <div className="divide-y divide-stone-100 max-h-[360px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.key} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-18 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">{item.name}</h5>
                    <p className="text-[11px] text-stone-500">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-bold text-stone-900 mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  Delivery ({district})
                </span>
                <span className="font-semibold text-stone-900">
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free Delivery</span>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
                <span>Total Amount Due</span>
                <span className="text-xl font-black">{formatPrice(totalPayable)}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero advance required. Inspect before payment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
