import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Loader2 } from 'lucide-react';
import { SEOHelmet } from '../components/SEOHelmet';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
        if (mounted) {
            navigate('/dashboard', { replace: true });
        }
    }, 1500);
    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <SEOHelmet title="Account Verification | Premier Tours" description="Processing email verification." noIndex={true} />
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center mx-auto animate-pulse">
          <Compass className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-heading font-bold text-[#10231D] dark:text-white">
          Authenticating...
        </h2>
        <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#0F9D72]" />
          Please wait...
        </p>
      </div>
    </div>
  );
};
