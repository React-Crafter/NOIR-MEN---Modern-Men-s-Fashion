import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="relative inline-flex items-center">
      <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-stone-500 pointer-events-none" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-8 pr-8 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-stone-200 rounded-lg text-stone-800 hover:border-stone-400 focus:outline-hidden focus:ring-1 focus:ring-black appearance-none cursor-pointer shadow-2xs"
      >
        <option value="featured">Featured First</option>
        <option value="newest">New Arrivals</option>
        <option value="popular">Popular Picks</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
