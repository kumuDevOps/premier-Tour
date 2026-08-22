import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Compass,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  Shield,
  KeyRound,
} from 'lucide-react';
import { SEED_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  onSuccess,
}) => {
  const { signIn, signUp, resetPassword, quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const showToast = (type: 'error' | 'success', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Please enter email and password.');
      return;
    }
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (!res.success && res.error) {
      showToast('error', typeof res.error === 'string' ? res.error : (res.error as any).message || 'Invalid credentials.');
    } else {
      showToast('success', 'Logged in successfully!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showToast('error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const res = await signUp(email, password, fullName);
    setSubmitting(false);

    if (!res.success && res.error) {
      showToast('error', typeof res.error === 'string' ? res.error : (res.error as any).message || 'Registration failed.');
    } else {
      showToast('success', 'Account created successfully!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('error', 'Please enter your email.');
      return;
    }
    setSubmitting(true);
    const res = await resetPassword(email);
    setSubmitting(false);
    if (res.success) {
      showToast('success', 'Reset link sent! Please check your email.');
    } else {
      showToast('error', typeof res.error === "string" ? res.error : (res.error as any)?.message || 'Failed to send reset link.');
    }
  };

  const handleQuickLogin = (role: 'user' | 'admin') => {
    quickDemoLogin(role);
    showToast('success', `Signed in as Demo ${role === 'admin' ? 'Admin' : 'Traveler'}`);
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md glass-card rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)] shadow-2xl overflow-hidden relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] dark:hover:text-white transition-colors z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-6 bg-slate-950 text-white text-center border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-emerald-700 border border-emerald-400/30 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
              <Compass className="w-5 h-5 text-emerald-100" />
            </div>
            <h2 className="font-sans text-lg font-bold">Premier Tour Booking</h2>
            <p className="text-xs text-emerald-300/90 mt-0.5">
              MongoDB Authentication Mode
            </p>
          </div>

          {/* Quick Demo Bar */}
          <div className="p-3 bg-emerald-50/50 dark:bg-[#073126]/40 border-b border-slate-200 dark:border-[var(--border-subtle)] text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="p-2 glass-card hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-[var(--border-subtle)] rounded-lg text-left transition-all cursor-pointer text-[11px]"
              >
                <span className="font-semibold block text-[var(--text)] dark:text-white">👤 Traveler Demo</span>
                <span className="text-[9px] text-[var(--muted)] block truncate">{SEED_USERS[0].email}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 rounded-lg text-left transition-all cursor-pointer text-[11px]"
              >
                <span className="font-semibold block text-emerald-300">🛡️ Admin Demo</span>
                <span className="text-[9px] text-slate-400 block truncate">{SEED_USERS[1].email}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-[var(--border-subtle)] bg-slate-100/60 dark:bg-[var(--background)] p-1 m-3 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('signin');
                setToast(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'glass-card text-[var(--primary-dark)] dark:text-emerald-300 shadow-sm'
                  : 'text-[var(--muted)] dark:text-[var(--muted)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setToast(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'glass-card text-[var(--primary-dark)] dark:text-emerald-300 shadow-sm'
                  : 'text-[var(--muted)] dark:text-[var(--muted)]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div
              className={`mx-4 mb-2 p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
                toast.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-[#031812]/40 dark:text-[var(--text-secondary)] dark:border-[var(--border-subtle)]'
              }`}
            >
              {toast.type === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{toast.message}</span>
            </div>
          )}

          {/* Tab 1: Sign in */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="p-4 pt-1 space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="traveler@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-slate-700 dark:text-[var(--text-secondary)]">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[10px] text-[var(--primary-dark)] dark:text-emerald-400 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="emerald-btn w-full py-2.5 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Sign In</span>}
              </button>
            </form>
          )}

          {/* Tab 2: Sign up */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="p-4 pt-1 space-y-2.5 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="traveler@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-8 py-1.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="emerald-btn w-full py-2.5 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 mt-1"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Create Account</span>}
              </button>
            </form>
          )}

          {/* Tab 3: Forgot */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="p-4 pt-1 space-y-3 text-xs">
              <div className="text-center">
                <p className="text-[11px] text-[var(--muted)] dark:text-[var(--muted)]">
                  Enter your email to receive password reset instructions.
                </p>
              </div>
              <input
                type="email"
                required
                placeholder="traveler@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl text-xs"
              />
              <button
                type="submit"
                disabled={submitting}
                className="emerald-btn w-full py-2.5 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Send Reset Email</span>}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-xs text-[var(--primary-dark)] dark:text-emerald-400 font-semibold"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <div className="p-3 bg-[var(--background)] dark:bg-[#031812]/80 border-t border-slate-200 dark:border-[var(--border-subtle)] text-center text-[10px] text-slate-400">
            Verified Booking Protection & SSL 256-Bit Encrypted
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
