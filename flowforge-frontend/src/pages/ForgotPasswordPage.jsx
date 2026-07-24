import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resetTokenData, setResetTokenData] = useState(null);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        showSuccess('Password reset link generated');
        setResetTokenData(res.data);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Unable to process request. Verify your email address.';
      showError(errMsg);
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
          Reset password
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          Enter your account email to receive a password reset link
        </p>
      </div>

      {resetTokenData ? (
        <div className="space-y-4 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in fade-in">
          <div className="flex items-center space-x-3 text-emerald-400">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <h3 className="text-sm font-bold">Reset Instructions Sent</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            We have generated a password reset token for <span className="font-semibold text-white">{email}</span>.
          </p>
          
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-400" />
              <span>Generated Token (Demo Mode)</span>
            </div>
            <code className="block text-xs font-mono text-brand-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
              {resetTokenData.resetToken}
            </code>
          </div>

          <Link
            to={`/reset-password?token=${resetTokenData.resetToken}`}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Reset Password</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
              Registered Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${
                  error ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                } rounded-xl text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Link...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Back to Login Link */}
      <div className="pt-2 text-center">
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
