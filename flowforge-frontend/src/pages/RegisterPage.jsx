import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Dynamic Password Strength Calculator
  const passwordCriteria = useMemo(() => {
    return [
      { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
      { id: 'uppercase', label: 'Uppercase & lowercase letters', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
      { id: 'number', label: 'At least 1 number (0-9)', met: /\d/.test(password) },
      { id: 'special', label: 'At least 1 special character (!@#$%)', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    return passwordCriteria.filter((c) => c.met).length;
  }, [password, passwordCriteria]);

  const strengthConfig = useMemo(() => {
    switch (strengthScore) {
      case 1:
        return { label: 'Weak', width: '25%', color: 'bg-rose-500', textColor: 'text-rose-400' };
      case 2:
        return { label: 'Fair', width: '50%', color: 'bg-amber-500', textColor: 'text-amber-400' };
      case 3:
        return { label: 'Good', width: '75%', color: 'bg-yellow-400', textColor: 'text-yellow-400' };
      case 4:
        return { label: 'Strong', width: '100%', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
      default:
        return { label: 'Too short', width: '0%', color: 'bg-slate-700', textColor: 'text-slate-500' };
    }
  }, [strengthScore]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
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
      const user = await register(name, email, password);
      showSuccess(`Account created! Welcome to FlowForge, ${user.name || 'Developer'}!`);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Registration failed. Email may already be in use.';
      showError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
          Create an account
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          Get started with your FlowForge workspace in seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${errors.name ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                } rounded-xl text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200`}
            />
          </div>
          {errors.name && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name}</p>}
        </div>

        {/* Email Address Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
            Work Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${errors.email ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                } rounded-xl text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border ${errors.password ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-slate-800 dark:border-slate-800 light:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
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
          {errors.password && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password}</p>}
        </div>

        {/* Dynamic Password Strength Bar */}
        {password && (
          <div className="space-y-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Password Strength:</span>
              <span className={`font-semibold ${strengthConfig.textColor}`}>{strengthConfig.label}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${strengthConfig.color}`}
                style={{ width: strengthConfig.width }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {passwordCriteria.map((c) => (
                <div key={c.id} className="flex items-center space-x-1.5 text-[11px]">
                  {c.met ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                  <span className={c.met ? 'text-slate-300 font-medium' : 'text-slate-500'}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Login Redirect */}
      <div className="pt-2 text-center text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors ml-1">
          Sign in instead
        </Link>
      </div>
    </div>
  );
};
