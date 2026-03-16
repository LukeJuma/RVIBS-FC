import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const SESSION_KEY = 'rvibs_admin_auth';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      // Keep sessionStorage flag for AdminLayout guard
      sessionStorage.setItem(SESSION_KEY, 'true');
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <img src="/rvibs_logo.jpeg" alt="RVIBS FC" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">RVIBS FC · Authorised Access Only</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-6" style={{ backgroundColor: '#00529F18' }}>
            <Lock className="w-6 h-6" style={{ color: '#00529F' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@rvibs.fc"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          RVIBS FC Admin Panel · Restricted Access
        </p>
      </motion.div>
    </div>
  );
}
