import React from 'react';
import { Outlet } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-100 text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300">
      {/* Top Bar Controls */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/10 light:bg-brand-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 rounded-2xl shadow-xl shadow-brand-500/25 mb-1 hover:scale-105 transition-transform duration-300">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300 light:from-slate-900 light:via-slate-800 light:to-slate-900 bg-clip-text text-transparent">
            FlowForge
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">
            Next-Gen Full Stack Project Management Platform
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 dark:shadow-black/50 light:shadow-slate-300/50 transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
