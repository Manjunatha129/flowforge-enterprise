import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};
    if (!token.trim()) {
      newErrors.token = 'Reset token is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await authService.resetPassword(token, newPassword);
      if (res.success) {
        setIsSuccess(true);
        showSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to reset password. Token may be invalid or expired.';
      showError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
          Set new password
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          Create a secure new password for your FlowForge account
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-4 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center animate-in fade-in">
          <div className="inline-flex p-3 bg-emerald-500/20 rounded-full text-emerald-400 mb-1">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Password Updated!</h3>
          <p className="text-xs text-slate-300">
            Your password has been changed successfully. Redirecting you to the sign-in page...
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors pt-2"
          >
            <span>Click here if not redirected automatically</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Token Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
              Reset Token
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste or enter reset token"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${errors.token ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                  } rounded-xl text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 font-mono`}
              />
            </div>
            {errors.token && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.token}</p>}
          </div>

          {/* New Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${errors.newPassword ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                  } rounded-xl text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${errors.confirmPassword ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                  } rounded-xl text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Redirect back to Login */}
      <div className="pt-2 text-center text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors ml-1">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};
