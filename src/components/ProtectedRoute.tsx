import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Compass, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, role, loading } = useAuth();
  const location = useLocation();

  console.log("PROTECTED ROUTE VERIFICATION:", {
    pathname: location.pathname,
    loading,
    authUserId: user?.id,
    authUserEmail: user?.email,
    profileRole: user?.role,
    resolvedRole: role,
    isAdmin,
    requireAdmin
  });

  // 1. Show loading state while session and user profile are resolving
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 animate-pulse mb-4">
          <Compass className="w-6 h-6 text-emerald-100 animate-spin" />
        </div>
        <p className="text-xs uppercase tracking-widest text-[var(--primary-dark)] dark:text-emerald-400 font-semibold flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Verifying Access Permissions...
        </p>
      </div>
    );
  }

  // 2. Non-logged-in guest redirect to /auth preserving intended location
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Admin role requirement check: requires verified 'admin' role
  if (requireAdmin) {
    if (!isAdmin || role !== 'admin') {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mb-6">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-[var(--text)] dark:text-white mb-3">
            Access Restricted
          </h1>
          <p className="text-[var(--muted)] dark:text-[var(--muted)] max-w-md mx-auto mb-8">
            You don't have permission to access the Premier Tours administration area. If you believe this is an error, please contact support.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="emerald-btn px-6 py-2.5 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return Home
            </Link>
            <Link to="/dashboard" className="btn-glass px-6 py-2.5 flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> My Account
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
