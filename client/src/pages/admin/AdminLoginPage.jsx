import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-800 border border-neutral-200">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">
            Atelier Staff Portal
          </h1>
          <p className="text-xs text-neutral-500">
            Secure administrative console for order management, dispatch updates, and catalog stock.
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-xl p-3.5 text-xs text-neutral-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preloaded Demo Credentials:</span>
          </div>
          <p className="text-neutral-500">
            Username: <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-black">admin</code> &nbsp;•&nbsp;
            Password: <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-black">admin123</code>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-black text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-neutral-500 hover:text-black">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
