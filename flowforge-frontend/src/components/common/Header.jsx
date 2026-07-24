import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, Menu, User, Settings, Check, Command, Sparkles, CheckCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { ThemeToggle } from './ThemeToggle';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { notificationService } from '../../services/notificationService';
import { websocketService } from '../../services/websocketService';

import { GlobalSearchModal } from './GlobalSearchModal';

export const Header = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { showInfo, showSuccess } = useToast();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    // Connect real-time STOMP WebSocket
    websocketService.connect();

    // Listen for live STOMP notifications broadcast
    const unsubscribeNotif = websocketService.onNotification((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
      if (!newNotif.readStatus) {
        setUnreadCount((prev) => prev + 1);
        showSuccess(`🔔 ${newNotif.title}`);
      }
    });

    return () => {
      unsubscribeNotif();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res && res.data) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.readStatus).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch header notifications:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
      setUnreadCount(0);
      showSuccess('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    websocketService.disconnect();
    logout();
    showInfo('Logged out of FlowForge workspace');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/90 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl transition-colors duration-300">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="relative w-full max-w-md hidden sm:flex items-center justify-between pl-10 pr-3 py-2 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-xl text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-500 hover:border-amber-500/40 transition-all text-left group"
        >
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-hover:text-amber-400 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <span>Search projects, tasks, messages, files...</span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-slate-700 dark:border-slate-700 light:border-slate-300 text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-500 bg-slate-900/60">
            <Command className="w-2.5 h-2.5 mr-0.5" />K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Connection Status, Theme Toggle, Notifications, Profile Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <ConnectionStatusBadge />
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in backdrop-blur-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              </div>

              {/* Notification Popover Items */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">No new notifications</div>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${!n.readStatus
                          ? 'bg-amber-500/10 border-amber-500/30 text-slate-100'
                          : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-semibold text-slate-200 leading-tight">{n.title}</div>
                        {!n.readStatus && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1"></span>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/notifications');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 text-amber-400 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-700/50"
              >
                <span>View All Notifications</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-800/80 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-800"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/20">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-left hidden md:block pr-1">
              <div className="text-xs font-semibold text-slate-200 leading-none">{user?.name || 'Developer'}</div>
              <div className="text-[10px] text-slate-400 leading-none mt-1">{user?.role || 'Team Lead'}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-800 text-xs">
                <div className="font-semibold text-slate-100">{user?.name || 'User'}</div>
                <div className="text-slate-400 text-[11px] truncate">{user?.email || 'user@FlowForge.dev'}</div>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Workspace Settings</span>
              </button>
              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ⌘K Global Search Command Palette Modal */}
      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </header>
  );
};
