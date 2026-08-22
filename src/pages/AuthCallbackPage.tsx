import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Compass, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SEOHelmet } from '../components/SEOHelmet';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const processAuthCallback = async () => {
      if (!isSupabaseConfigured) {
        if (mounted) {
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        }
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth callback verification error:", error);
          if (mounted) {
            setStatus('error');
            setErrorMessage(error.message || 'Confirmation link was invalid or expired.');
          }
          return;
        }

        if (session?.user) {
          if (mounted) {
            setStatus('success');
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1200);
          }
        } else {
          // Listen briefly for state change if token hash is being exchanged
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (event === 'SIGNED_IN' || newSession?.user) {
              if (mounted) {
                setStatus('success');
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                }, 1000);
              }
            }
          });

          setTimeout(() => {
            subscription.unsubscribe();
            if (mounted && status === 'verifying') {
              if (user) {
                setStatus('success');
                navigate('/dashboard', { replace: true });
              } else {
                setStatus('error');
                setErrorMessage('Email confirmation link was processed or expired. Please sign in with your credentials.');
              }
            }
          }, 3000);
        }
      } catch (err: any) {
        if (mounted) {
          setStatus('error');
          setErrorMessage(err?.message || 'Verification encountered an error.');
        }
      }
    };

    processAuthCallback();

    return () => {
      mounted = false;
    };
  }, [navigate, user]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <SEOHelmet title="Account Verification | Premier Tours" description="Processing email verification." noIndex={true} />

      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl text-center space-y-4">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center mx-auto animate-pulse">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-heading font-bold text-[#10231D] dark:text-white">
              Confirming Email Address...
            </h2>
            <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#0F9D72]" />
              Authenticating session and synchronizing profile...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-heading font-bold text-[#10231D] dark:text-white">
              Email Verified Successfully!
            </h2>
            <p className="text-xs text-[#71817B] dark:text-[#8FA9A0]">
              Welcome to Premier Tours. Redirecting you to your account dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-heading font-bold text-[#10231D] dark:text-white">
              Verification Link
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {errorMessage || 'Verification link could not be processed.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/auth', { replace: true })}
                className="emerald-btn px-6 py-2.5 text-xs font-bold w-full"
              >
                Go to Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
