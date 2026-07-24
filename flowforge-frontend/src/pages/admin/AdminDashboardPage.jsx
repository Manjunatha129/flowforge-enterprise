import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Globe,
  FolderKanban,
  CheckSquare,
  HardDrive,
  FileText,
  Bell,
  Shield,
  Activity,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

/**
 * Admin Dashboard Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Serves live real-time statistics (total/active/online/offline users, projects, tasks, storage, reports).
 * Computes all metrics dynamically from database queries with Ember Orange branding.
 */
export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Fetching live system metrics from database..." />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, accent: 'from-amber-500/20 to-orange-500/10 text-amber-400', border: 'border-amber-500/20' },
    { title: 'Active Accounts', value: stats?.activeUsers || 0, icon: UserCheck, accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-400', border: 'border-emerald-500/20' },
    { title: 'Online Sessions', value: stats?.onlineUsers || 0, icon: Globe, accent: 'from-purple-500/20 to-indigo-500/10 text-purple-400', border: 'border-purple-500/20' },
    { title: 'Offline Accounts', value: stats?.offlineUsers || 0, icon: Activity, accent: 'from-slate-800 to-slate-900 text-slate-400', border: 'border-slate-800' },
    
    { title: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, accent: 'from-amber-500/20 to-yellow-500/10 text-amber-400', border: 'border-amber-500/20' },
    { title: 'Active Projects', value: stats?.activeProjects || 0, icon: FolderKanban, accent: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400', border: 'border-emerald-500/20' },
    { title: 'Completed Projects', value: stats?.completedProjects || 0, icon: FolderKanban, accent: 'from-cyan-500/20 to-teal-500/10 text-cyan-400', border: 'border-cyan-500/20' },
    { title: 'Archived Projects', value: stats?.archivedProjects || 0, icon: FolderKanban, accent: 'from-slate-800 to-slate-900 text-slate-400', border: 'border-slate-800' },

    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: CheckSquare, accent: 'from-amber-500/20 to-orange-500/10 text-amber-400', border: 'border-amber-500/20' },
    { title: 'Completed Tasks', value: stats?.completedTasks || 0, icon: CheckSquare, accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-400', border: 'border-emerald-500/20' },
    { title: 'Pending Workload', value: stats?.pendingTasks || 0, icon: CheckSquare, accent: 'from-purple-500/20 to-violet-500/10 text-purple-400', border: 'border-purple-500/20' },
    { title: 'Overdue Alerts', value: stats?.overdueTasks || 0, icon: CheckSquare, accent: 'from-rose-500/20 to-red-500/10 text-rose-400', border: 'border-rose-500/20' },

    { title: 'Notifications Sent', value: stats?.notificationsSent || 0, icon: Bell, accent: 'from-amber-500/20 to-yellow-500/10 text-amber-400', border: 'border-amber-500/20' },
    { title: 'Reports Generated', value: stats?.reportsGenerated || 0, icon: FileText, accent: 'from-teal-500/20 to-cyan-500/10 text-teal-400', border: 'border-teal-500/20' },
    { title: 'Storage Allocation', value: stats?.storageUsed || '0 MB', icon: HardDrive, accent: 'from-purple-500/20 to-indigo-500/10 text-purple-400', border: 'border-purple-500/20' },
    { title: 'New Users This Month', value: stats?.newUsersThisMonth || 0, icon: Users, accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-400', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>System Operations Dashboard</span>
            <Shield className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time infrastructure analytics, user counts, storage metrics, and application health
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 16 Live Statistics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.accent} border ${card.border} backdrop-blur-xl shadow-xl space-y-3 transition-transform duration-200 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/users')}
          className="p-6 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all space-y-3 shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">User Management</h3>
            <p className="text-xs text-slate-400 mt-1">Promote admins, deactivate accounts, reset passwords, and audit user login times.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/audit-logs')}
          className="p-6 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all space-y-3 shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Security Audit Logs</h3>
            <p className="text-xs text-slate-400 mt-1">Review authenticated actions, role changes, settings updates, and system events.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/settings')}
          className="p-6 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all space-y-3 shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">System Configuration</h3>
            <p className="text-xs text-slate-400 mt-1">Configure JWT timeouts, company branding, maintenance mode, and session policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
