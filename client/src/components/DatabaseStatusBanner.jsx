import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { checkApiHealth } from '../services/api.js';

export default function DatabaseStatusBanner() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    setLoading(true);
    const res = await checkApiHealth();
    setHealth(res);
    setLoading(false);
  };

  useEffect(() => {
    check();
  }, []);

  if (loading) return null;

  const isConnected = health?.ok && health.data?.mongodb === 'connected';

  return (
    <div className={`text-xs py-2 px-4 border-b flex items-center justify-between ${
      isConnected
        ? 'bg-emerald-950/20 text-emerald-300 border-emerald-800/40'
        : 'bg-amber-950/30 text-amber-200 border-amber-800/40'
    }`}>
      <div className="flex items-center gap-2">
        <Database className="w-3.5 h-3.5" />
        <span>
          <strong>Database:</strong> {isConnected ? 'Connected to MongoDB Atlas' : 'Local Fallback Mode (Set MONGODB_URI in .env for Atlas sync)'}
        </span>
      </div>
      <button
        onClick={check}
        className="flex items-center gap-1 opacity-80 hover:opacity-100 hover:underline cursor-pointer"
        title="Refresh connection status"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Check</span>
      </button>
    </div>
  );
}
