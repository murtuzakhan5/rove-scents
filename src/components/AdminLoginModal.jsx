import React, { useState } from 'react';
import { Lock, X, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess();
        onClose();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-[#121212] border border-gold-500/40 rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-[#222] transition"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gold-950/80 border border-gold-500/40 flex items-center justify-center mx-auto text-gold-400 shadow-md">
            <Lock size={22} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Staff Portal Login
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Secure store administration for ROVE SCENTS
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Access Dashboard'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="p-2.5 rounded bg-[#181818] border border-[#262626] text-center text-[10px] text-zinc-400">
            Demo Credentials: Username: <strong className="text-white">admin</strong> | Password: <strong className="text-white">admin123</strong>
          </div>
        </form>

      </div>
    </div>
  );
}
