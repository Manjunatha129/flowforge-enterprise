import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Bell,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  X,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { showInfo } = useToast();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Team Chat', path: '/chat', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Activity Feed', path: '/activities', icon: Activity },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    showInfo('Logged out of FlowForge workspace');
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar Main Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-slate-900/95 dark:bg-slate-900/95 light:bg-white border-r border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out backdrop-blur-xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="space-y-6">
          {/* Top Brand & Close Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-2 rounded-xl shadow-lg shadow-brand-500/25">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 dark:from-white dark:via-slate-200 dark:to-slate-400 light:from-slate-900 light:via-slate-800 light:to-slate-900 bg-clip-text text-transparent">
                Flow<span className="text-brand-400">Forge</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Workspace Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                      ? 'bg-gradient-to-r from-brand-500/15 via-brand-500/10 to-transparent text-brand-400 dark:text-brand-400 light:text-brand-600 border border-brand-500/20 shadow-sm'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-slate-100 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-400 rounded-r-full shadow-md shadow-brand-400/50"></div>
                      )}
                      <Icon
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-brand-400' : 'text-slate-400'
                          }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info & Logout */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="p-3 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs border border-brand-500/30 shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 truncate">
                  {user?.name || 'Developer'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{user?.email || 'user@FlowForge.dev'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] text-slate-500">
            <div className="flex items-center space-x-1">
              <Layers className="w-3 h-3 text-brand-400" />
              <span>FlowForge v1.0</span>
            </div>
            <span className="text-emerald-400 font-medium">● Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
};
