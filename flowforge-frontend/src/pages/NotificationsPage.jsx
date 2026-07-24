import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  FolderPlus,
  UserPlus,
  MessageSquare,
  FileText,
  Search,
  Filter,
  CheckCheck,
  Trash2,
  Sparkles,
  Inbox,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * Notifications Center Page Component.
 * 
 * WHY THIS PAGE EXISTS:
 * Serves as the central hub for workspace alert management (/notifications).
 * Supports search, multi-field filtering by notification type & priority urgency,
 * sorting, individual mark-read/delete actions, and bulk clear operations.
 */
export const NotificationsPage = () => {
  const { showSuccess, showError, showInfo } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
      showError('Failed to load notifications from server');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
      );
      showSuccess('Notification marked as read');
    } catch (err) {
      showError('Could not update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
      showSuccess('All notifications marked as read');
    } catch (err) {
      showError('Could not mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showInfo('Notification deleted');
    } catch (err) {
      showError('Could not delete notification');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      showInfo('All notifications cleared');
    } catch (err) {
      showError('Failed to clear notifications');
    }
  };

  // Helper mapping notification icon string to Lucide React component
  const renderNotificationIcon = (type, iconName) => {
    switch (type) {
      case 'PROJECT_CREATED':
      case 'PROJECT_UPDATED':
        return <FolderPlus className="w-5 h-5 text-amber-500" />;
      case 'TASK_ASSIGNED':
      case 'TASK_COMPLETED':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'TASK_OVERDUE':
      case 'TASK_DUE_SOON':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'MEMBER_JOINED':
      case 'MEMBER_INVITED':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-5 h-5 text-cyan-500" />;
      case 'FILE_UPLOADED':
      case 'REPORT_GENERATED':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-amber-500" />;
    }
  };

  // Get Priority Border Styling (#FF8A00 High, #7C3AED Medium, #22C55E Low)
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'border-l-4 border-l-amber-500 bg-amber-500/5';
      case 'MEDIUM':
        return 'border-l-4 border-l-purple-500 bg-purple-500/5';
      case 'LOW':
        return 'border-l-4 border-l-emerald-500 bg-emerald-500/5';
      default:
        return 'border-l-4 border-l-slate-700 bg-slate-900/40';
    }
  };

  // Filter & Search Logic
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.sender?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'PROJECT' && (n.type.includes('PROJECT') || n.relatedProject)) ||
      (typeFilter === 'TASK' && (n.type.includes('TASK') || n.relatedTask)) ||
      (typeFilter === 'SYSTEM' && (n.type.includes('MEMBER') || n.type.includes('REPORT')));

    const matchesPriority = priorityFilter === 'ALL' || n.priority === priorityFilter;
    const matchesUnread = !unreadOnly || !n.readStatus;

    return matchesSearch && matchesType && matchesPriority && matchesUnread;
  }).sort((a, b) => {
    if (sortOrder === 'NEWEST') return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.readStatus).length;
  const highPriorityCount = notifications.filter((n) => n.priority === 'HIGH').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Notification Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time workspace activity alerts, task updates, and system events
              </p>
            </div>
          </div>
        </div>

        {/* Global Bulk Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={fetchNotifications}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
            title="Refresh Feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={handleClearAll}
            disabled={totalCount === 0}
            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Total Notifications</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{totalCount}</div>
        </div>
        <div className="bg-slate-900/60 border border-amber-500/30 p-4 rounded-2xl bg-amber-500/5">
          <div className="text-xs font-medium text-amber-400">Unread Alerts</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{unreadCount}</div>
        </div>
        <div className="bg-slate-900/60 border border-rose-500/30 p-4 rounded-2xl bg-rose-500/5">
          <div className="text-xs font-medium text-rose-400">High Priority</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{highPriorityCount}</div>
        </div>
        <div className="bg-slate-900/60 border border-purple-500/30 p-4 rounded-2xl bg-purple-500/5">
          <div className="text-xs font-medium text-purple-400">System Activity</div>
          <div className="text-2xl font-bold text-purple-300 mt-1">{totalCount - unreadCount}</div>
        </div>
      </div>

      {/* Controls Bar: Search, Filters, Sort */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4 backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification title, message or sender..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Types</option>
              <option value="PROJECT" className="bg-slate-900">Projects</option>
              <option value="TASK" className="bg-slate-900">Tasks</option>
              <option value="SYSTEM" className="bg-slate-900">System & Members</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Priorities</option>
              <option value="HIGH" className="bg-slate-900">High Urgency</option>
              <option value="MEDIUM" className="bg-slate-900">Medium</option>
              <option value="LOW" className="bg-slate-900">Low</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
            className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>{sortOrder === 'NEWEST' ? 'Newest First' : 'Oldest First'}</span>
          </button>

          {/* Unread Toggle */}
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              unreadOnly
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Notifications List Grid */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-800/80 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Inbox className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Notifications Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery || typeFilter !== 'ALL' || priorityFilter !== 'ALL' || unreadOnly
                ? 'No notifications match your selected search criteria.'
                : 'You are all caught up! No recent alerts in your workspace.'}
            </p>
          </div>
          {(searchQuery || typeFilter !== 'ALL' || priorityFilter !== 'ALL' || unreadOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setPriorityFilter('ALL');
                setUnreadOnly(false);
              }}
              className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 group ${
                getPriorityStyle(n.priority)
              } ${!n.readStatus ? 'shadow-md shadow-amber-500/5' : 'opacity-80 hover:opacity-100'}`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon Container */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0">
                  {renderNotificationIcon(n.type, n.icon)}
                </div>

                {/* Main Text Content */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{n.title}</h4>

                    {/* Unread Badge */}
                    {!n.readStatus && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    )}

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        n.priority === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : n.priority === 'MEDIUM'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {n.priority}
                    </span>

                    {/* Project / Task Context Badge */}
                    {n.relatedProject && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                        {n.relatedProject}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                    <span>Sender: <strong>{n.sender || 'System'}</strong></span>
                    <span>•</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                {!n.readStatus && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
