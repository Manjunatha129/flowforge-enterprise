import React, { useState, useEffect } from 'react';
import {
  Activity,
  User,
  FolderPlus,
  CheckCircle,
  FileText,
  MessageSquare,
  UserPlus,
  LogIn,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { activityService } from '../services/activityService';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * Workspace Activity Feed Page Component.
 * 
 * WHY THIS PAGE EXISTS:
 * Provides a unified real-time audit log timeline (/activities) recording project updates,
 * task completions, comment discussions, document uploads, member invites, and security logins.
 */
export const ActivityFeedPage = () => {
  const { showError } = useToast();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBadge, setFilterBadge] = useState('ALL');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await activityService.getActivities();
      if (res && res.data) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error(err);
      showError('Failed to load workspace activity stream');
    } finally {
      setLoading(false);
    }
  };

  const renderBadgeIcon = (statusBadge) => {
    switch (statusBadge) {
      case 'PROJECT_CREATED':
        return <FolderPlus className="w-4 h-4 text-amber-400" />;
      case 'TASK_COMPLETED':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'FILE_UPLOADED':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'MEMBER_INVITED':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'USER_LOGGED_IN':
        return <LogIn className="w-4 h-4 text-indigo-400" />;
      case 'REPORT_GENERATED':
        return <BarChart3 className="w-4 h-4 text-rose-400" />;
      default:
        return <Activity className="w-4 h-4 text-amber-400" />;
    }
  };

  const filteredActivities = activities.filter((a) => {
    const matchesSearch =
      a.activity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBadge = filterBadge === 'ALL' || a.statusBadge === filterBadge;

    return matchesSearch && matchesBadge;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Workspace Activity Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Audit log timeline tracking project changes, team actions, and sprint milestones
            </p>
          </div>
        </div>

        <button
          onClick={fetchActivities}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Timeline</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity, member name, or action..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={filterBadge}
            onChange={(e) => setFilterBadge(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Event Types</option>
            <option value="PROJECT_CREATED" className="bg-slate-900">Projects Created</option>
            <option value="TASK_COMPLETED" className="bg-slate-900">Tasks Completed</option>
            <option value="FILE_UPLOADED" className="bg-slate-900">Files Uploaded</option>
            <option value="COMMENT_ADDED" className="bg-slate-900">Comments</option>
            <option value="MEMBER_INVITED" className="bg-slate-900">Member Invites</option>
            <option value="USER_LOGGED_IN" className="bg-slate-900">User Logins</option>
            <option value="REPORT_GENERATED" className="bg-slate-900">Reports</option>
          </select>
        </div>
      </div>

      {/* Activity Stream List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-800/80 text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Activity Found</h3>
            <p className="text-xs text-slate-400 mt-1">No event records match your search criteria.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pl-6">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[35px] top-1.5 p-1.5 rounded-full bg-slate-950 border border-slate-800 group-hover:border-amber-500/50 transition-colors">
                  {renderBadgeIcon(act.statusBadge)}
                </div>

                {/* Event Card */}
                <div className="bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-2xl transition-all space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                        {act.userAvatar || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-200">{act.userName}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{act.timeAgo || 'Recently'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 pl-9 leading-relaxed">{act.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
