import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ExternalLink, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      // Ensure any legacy localStorage auth is stripped
      localStorage.removeItem('noir_admin_auth');
      return Boolean(sessionStorage.getItem('noir_admin_auth'));
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync auth state on location change
  useEffect(() => {
    try {
      setIsAuthenticated(Boolean(sessionStorage.getItem('noir_admin_auth')));
    } catch {
      setIsAuthenticated(false);
    }
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('noir_admin_auth');
      localStorage.removeItem('noir_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    navigate('/admin/login', { replace: true });
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag }
  ];

  const isCurrentActive = (item) => {
    if (item.exact) {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="bg-neutral-900 text-white sticky top-0 z-40 border-b border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Admin Tag */}
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-2">
                <span
                  className="text-lg font-extrabold tracking-wider text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  NOIR MEN
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-neutral-800 border border-neutral-700 text-neutral-300 rounded">
                  Admin
                </span>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center space-x-1 ml-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isCurrentActive(item);
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                        active
                          ? 'bg-neutral-800 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Store Link & Logout */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors py-1.5 px-2.5 rounded hover:bg-neutral-800"
                title="View customer-facing storefront"
              >
                <span>View Store</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-neutral-800 px-3 py-1.5 rounded transition-colors font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-900 px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold ${
                    active ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <span>View Store</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
