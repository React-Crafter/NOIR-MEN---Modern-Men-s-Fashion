import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear any legacy persistent authentication from localStorage on mount
  useEffect(() => {
    try {
      localStorage.removeItem('noir_admin_auth');
    } catch {
      // ignore
    }
  }, []);

  const targetRedirect = location.state?.from || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.adminLogin(username.trim(), password.trim());
      if (res.success) {
        try {
          localStorage.removeItem('noir_admin_auth');
          sessionStorage.setItem('noir_admin_auth', JSON.stringify({
            token: res.token,
            user: res.user,
            loginTime: new Date().toISOString()
          }));
        } catch {
          // ignore
        }
        if (onLoginSuccess) onLoginSuccess();
        navigate(targetRedirect, { replace: true });
      }
    } catch (err) {
      // Local fallback for offline demo
      if (
        (username === 'admin' && (password === 'admin' || password === 'admin123')) ||
        (username === 'demo' && password === 'demo123')
      ) {
        try {
          localStorage.removeItem('noir_admin_auth');
          sessionStorage.setItem('noir_admin_auth', JSON.stringify({
            token: 'demo-local-token',
            user: { username: 'admin', name: 'Store Manager', role: 'Admin' },
            loginTime: new Date().toISOString()
          }));
        } catch {
          // ignore
        }
        if (onLoginSuccess) onLoginSuccess();
        navigate(targetRedirect, { replace: true });
      } else {
        setError(err.message || 'Invalid username or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    try {
      localStorage.removeItem('noir_admin_auth');
      sessionStorage.setItem('noir_admin_auth', JSON.stringify({
        token: 'demo-quick-token',
        user: { username: 'admin', name: 'Store Manager', role: 'Admin' },
        loginTime: new Date().toISOString()
      }));
    } catch {
      // ignore
    }
    if (onLoginSuccess) onLoginSuccess();
    navigate(targetRedirect, { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-neutral-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Public Store
          </Link>
        </div>

        <div className="text-center">
          <h1
            className="text-3xl font-extrabold tracking-tight text-white uppercase"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            NOIR MEN
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-neutral-400">
            Admin Management Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-800/80 backdrop-blur border border-neutral-700/80 py-8 px-6 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white rounded text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white rounded text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-white text-neutral-900 rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-6 pt-5 border-t border-neutral-700/60">
            <div className="bg-neutral-900/80 p-3.5 rounded border border-neutral-700 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold mb-1">
                <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                Demo Credentials for Clients:
              </div>
              <div className="text-neutral-400 space-y-0.5 text-[11px]">
                <div>Username: <strong className="text-white">admin</strong></div>
                <div>Password: <strong className="text-white">admin123</strong></div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="mt-3 w-full py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-[11px] font-medium text-neutral-200 transition-colors"
              >
                1-Click Quick Demo Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
