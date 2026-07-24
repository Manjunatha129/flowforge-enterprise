import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Admin Route Guard Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Protects all /admin/** routes. If an unauthenticated user or a non-admin account (ROLE_USER)
 * attempts access, it renders a high-impact 403 Forbidden Access Denied card.
 */
export const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Authenticating Admin Credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-rose-500/10">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">403 Access Denied</span>
            <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Admin Access Required</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your account (<span className="text-slate-200 font-semibold">{user?.email}</span>) does not have administrator privileges required to access `/admin` resources.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex items-center justify-center space-x-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Workspace</span>
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
