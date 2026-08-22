import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { SEOHelmet } from '../components/SEOHelmet';
import {
  Compass,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Shield,
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const AuthPage: React.FC = () => {
  const { t } = useLanguage();
  const { signIn, signUp, resetPassword, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Tabs: 'signin' | 'signup' | 'forgot'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Clear toast after 6s
  const showToast = (type: 'error' | 'success', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  // Resend confirmation handler
  const handleResendConfirmation = async () => {
    const targetEmail = pendingConfirmationEmail || email;
    if (!targetEmail) {
      showToast('error', 'Please provide an email address.');
      return;
    }
    setResendingEmail(true);
    const res = await resendConfirmationEmail(targetEmail);
    setResendingEmail(false);
    if (res.success) {
      showToast('success', `Verification email sent to ${targetEmail}! Please inspect your inbox and click the link to confirm.`);
    } else {
      showToast('error', res.error || 'Unable to resend confirmation email.');
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score: 3, label: 'Strong & Secure', color: 'bg-[var(--primary)]', text: 'text-[var(--primary)]' };
  };

  const strength = getPasswordStrength(password);

  // Sign In Handler with Role-Based Redirection
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const result = await signIn(email.trim(), password.trim());
      
      if (!result.success && result.error) {
        const msg =
          typeof result.error === 'string'
            ? result.error
            : (result.error as any).message || 'Invalid login credentials. Please verify your email and password.';
        if (result.requiresConfirmation || msg.toLowerCase().includes('confirmation')) {
          setPendingConfirmationEmail(email.trim());
        }
        showToast('error', msg);
      } else {
        showToast('success', 'Authentication successful! Redirecting...');
        const targetRole = result.role || result.user?.role || 'user';
        setTimeout(() => {
          if (targetRole === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate(from && from !== '/admin' ? from : '/dashboard', { replace: true });
          }
        }, 1500);
      }
    } catch (err: any) {
      showToast('error', err.message || 'An unexpected error occurred during login.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      showToast('error', 'Please complete all required registration fields.');
      return;
    }

    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (!agreeTerms) {
      showToast('error', 'Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const result = await signUp(fullName, email, password);
      
      if (!result.success && result.error) {
        const msg =
          typeof result.error === 'string'
            ? result.error
            : (result.error as any).message || 'Sign up encountered an issue.';
        if (msg.toLowerCase().includes('already registered')) {
          showToast('error', 'User already registered. Please switch to Sign In.');
        } else {
          showToast('error', msg);
        }
      } else {
        if (result.requiresConfirmation) {
          setPendingConfirmationEmail(email.trim());
          showToast('success', `Account created successfully! We sent a confirmation email to ${email.trim()}. Please verify your email before signing in.`);
          setActiveTab('signin');
        } else {
          showToast('success', 'Account created successfully! Redirecting to your dashboard...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 700);
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setSubmitting(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('error', 'Please provide your registered email address.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        showToast('success', (result as any).message || 'Password reset link sent to your email.');
      } else {
        showToast('error', (result as any).error?.message || (result as any).error || 'Failed to dispatch password reset request.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'An unexpected error occurred during password reset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="auth-page" className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] transition-colors">
      <SEOHelmet
        title="Member Authentication | Premier Tour Booking"
        description="Sign in or register for Premier Tour Booking with verified secure access."
        noIndex={true}
      />

      <div className="max-w-md w-full glass-card rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)] shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/80 overflow-hidden">
        {/* Card Header & Brand */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-7 text-center border-b border-slate-800 relative">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <Logo size="lg" to="/" className="flex-col !max-w-none text-center" />
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-[var(--border-subtle)] bg-slate-100/60 dark:bg-[var(--background)] p-1.5 m-4 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setToast(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'glass-card text-[var(--primary-dark)] dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-[var(--border-subtle)]'
                : 'text-[var(--muted)] dark:text-[var(--muted)] hover:text-[var(--text)] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setToast(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'glass-card text-[var(--primary-dark)] dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-[var(--border-subtle)]'
                : 'text-[var(--muted)] dark:text-[var(--muted)] hover:text-[var(--text)] dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Toast Alert Notification & Confirmation Prompt */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`mx-4 mb-3 p-3.5 rounded-xl text-xs flex flex-col gap-2 border ${
                toast.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-[#031812]/40 text-emerald-800 dark:text-[var(--text-secondary)] border-emerald-300 dark:border-[var(--border-subtle)]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span className="flex-1 leading-snug font-medium">{toast.message}</span>
              </div>

              {pendingConfirmationEmail && (
                <div className="pt-2 border-t border-slate-200 dark:border-emerald-800/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">Didn't receive the email?</span>
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendingEmail}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {resendingEmail ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Resend Email</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 1: Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="p-6 pt-1 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('auth_email') || 'Email Address'}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="traveler@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)]">{t('auth_password') || 'Password'}</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[11px] text-[var(--primary-dark)] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--muted)] dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[var(--primary-dark)] border-slate-300 focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--muted)] dark:text-[var(--muted)] text-[11px]">{t('auth_remember') || 'Remember my device'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="emerald-btn w-full py-3 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth_signing_in') || 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{t('auth_signin') || 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Create Account */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="p-6 pt-1 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('auth_full_name') || 'Full Name'}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Evelyn Sinclair"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('auth_email') || 'Email Address'}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="traveler@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('auth_create_password') || 'Create Password'}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--muted)] dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[var(--muted)] dark:text-[var(--muted)]">Password Strength:</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-[var(--surface-subtle)] rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-transparent'} w-1/3`} />
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-transparent'} w-1/3`} />
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-transparent'} w-1/3`} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--muted)] dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded text-[var(--primary-dark)] border-slate-300 focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--muted)] dark:text-[var(--muted)] text-[11px] leading-tight">
                  I agree to the <span className="text-[var(--primary-dark)] dark:text-emerald-400 underline">Terms of Service</span> & Privacy Policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="emerald-btn w-full py-3 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth_creating_account') || 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{t('auth_create_account') || 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 3: Forgot Password View */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="p-6 pt-2 space-y-4 text-xs">
            <div className="text-center py-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-[#031812]/60 border border-emerald-300 dark:border-[var(--border-subtle)] text-[var(--primary-dark)] dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-[var(--text)] dark:text-white">{t('auth_reset') || 'Reset Account Password'}</h3>
              <p className="text-[var(--muted)] dark:text-[var(--muted)] text-[11px] mt-1">
                Enter your registered email to receive official password reset instructions.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('auth_email') || 'Email Address'}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="traveler@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--background)] dark:bg-[#073126]/80 border border-slate-300 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="emerald-btn w-full py-3 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth_dispatching') || 'Dispatching Reset Link...'}</span>
                </>
              ) : (
                <>
                  <span>{t('auth_send_reset') || 'Send Password Reset Email'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setToast(null);
                }}
                className="text-[var(--muted)] dark:text-[var(--muted)] hover:text-[var(--primary-dark)] dark:hover:text-emerald-400 text-xs font-semibold cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Security badge footer */}
        <div className="p-4 bg-[var(--background)] dark:bg-[#031812]/80 border-t border-slate-200 dark:border-[var(--border-subtle)] text-center flex items-center justify-center gap-2 text-[11px] text-[var(--muted)] dark:text-[var(--muted)]">
          <Shield className="w-3.5 h-3.5 text-[var(--primary-dark)] dark:text-emerald-400" />
          <span>SSL 256-Bit Encrypted & SLTDA Certified Travel Agency</span>
        </div>
      </div>
    </div>
  );
};
