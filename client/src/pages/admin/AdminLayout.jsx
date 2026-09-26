import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext.jsx';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, Database } from 'lucide-react';

export default function AdminLayout() {
  const { adminUser, logoutAdmin, serverStatus } = useProducts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const isDbConnected = serverStatus?.mongodb === 'connected';

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] text-stone-300 flex flex-col shrink-0 border-r border-stone-800">
        <div className="p-6 border-b border-stone-800">
          <Link to="/" className="inline-block">
            <span className="text-xl font-black text-white font-serif tracking-tight">
              NOIR<span className="text-stone-500 font-sans font-light text-base ml-1">ADMIN</span>
            </span>
          </Link>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-stone-400 text-[11px]">
              {isDbConnected ? 'MongoDB Atlas Live' : 'Demo Memory / Offline'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1 text-xs font-bold uppercase tracking-wider">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white text-black font-extrabold shadow-sm' : 'hover:bg-white/10 text-stone-400 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white text-black font-extrabold shadow-sm' : 'hover:bg-white/10 text-stone-400 hover:text-white'
              }`
            }
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white text-black font-extrabold shadow-sm' : 'hover:bg-white/10 text-stone-400 hover:text-white'
              }`
            }
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders</span>
          </NavLink>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Storefront</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
