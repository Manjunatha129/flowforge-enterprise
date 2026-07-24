import React, { useMemo } from 'react';
import { Calendar, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Dashboard Greeting Banner Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders a personalized user greeting banner and displays workspace onboarding message
 * when a user has 0 projects, or real high-priority item alerts when workspace projects exist.
 */
export const GreetingBanner = ({ stats }) => {
  const { user } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const currentDate = useMemo(() => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }, []);

  const totalProjects = stats?.totalProjects ?? 0;
  const highPriorityCount = stats?.highPriorityTasks ?? 0;
  const sprintHealth = stats?.sprintHealth ?? 100;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-500/20 p-6 sm:p-8 shadow-2xl shadow-black/40">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Workspace Overview</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {greeting}, <span className="bg-gradient-to-r from-white via-brand-200 to-cyan-300 bg-clip-text text-transparent">{user?.name || 'Developer'}</span>! 👋
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {totalProjects === 0 ? (
              <>Welcome to FlowForge! Create your first project to start collaborating.</>
            ) : (
              <>
                Here is what's happening across your FlowForge projects and active sprint tasks today. You have <strong className="text-brand-300">{highPriorityCount} high-priority item{highPriorityCount === 1 ? '' : 's'}</strong> needing attention.
              </>
            )}
          </p>
        </div>

        {/* Date & Performance Widget */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-950/70 backdrop-blur-md rounded-xl border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span className="font-medium">{currentDate}</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Sprint Health: {sprintHealth}% Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
