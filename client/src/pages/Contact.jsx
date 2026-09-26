import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { useProducts } from '../context/ProductContext.jsx';

export default function Contact() {
  const { addToast } = useProducts();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      addToast('Please provide your name and phone number', 'error');
      return;
    }
    setSent(true);
    addToast('Thank you! Our concierge will contact you within 2 business hours.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-stone-500 mb-2 block">
          Concierge & Showrooms
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 font-serif tracking-tight mb-4">
          We Are At Your Service
        </h1>
        <p className="text-sm text-stone-600 font-light">
          Visit our flagship ateliers in Dhaka or connect directly with our style concierge for personal fitting advice and bulk orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info & Showrooms */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Direct Contact
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Hotline & WhatsApp:</strong>
                  <span>+880 1712-345678 (10:00 AM - 10:00 PM)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Email:</strong>
                  <span>concierge@noirmen.com.bd</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Customer Support Hours:</strong>
                  <span>Saturday to Thursday: 10:00 AM – 10:00 PM (Friday: 2:00 PM – 10:00 PM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Flagship Atelier</span>
              <h4 className="text-sm font-bold text-stone-900">Banani, Dhaka</h4>
              <p className="text-stone-600">House 42, Road 11, Block D, Banani Commercial Area, Dhaka-1213</p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Studio & Lounge</span>
              <h4 className="text-sm font-bold text-stone-900">Dhanmondi, Dhaka</h4>
              <p className="text-stone-600">Level 3, Imperial Tower, Road 27 (Old), Dhanmondi, Dhaka-1209</p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs">
          <h3 className="text-lg font-bold text-stone-900 mb-2">Send an Inquiry</h3>
          <p className="text-xs text-stone-500 mb-6">
            For bespoke size inquiries, corporate bulk orders, or exchange requests.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-stone-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-stone-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Message or Order Notes
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can our concierge team assist you today?"
                className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
