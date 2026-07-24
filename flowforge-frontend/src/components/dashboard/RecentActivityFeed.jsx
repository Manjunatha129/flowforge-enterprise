import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitPullRequest, Clock, Activity } from 'lucide-react';
import { activityService } from '../../services/activityService';

/**
 * Dashboard Recent Activity Feed Component.
 * 
 * PURPOSE:
 * Renders real-time activity stream on the main dashboard fetched from /api/v1/activities REST endpoint.
 */
export const RecentActivityFeed = ({ activities: propActivities }) => {
  const navigate = useNavigate();
  const [list, setList] = useState(propActivities || []);

  useEffect(() => {
    if (!propActivities) {
      fetchLiveActivities();
    }
  }, [propActivities]);

  const fetchLiveActivities = async () => {
    try {
      const res = await activityService.getActivities();
      if (res && res.data) {
        setList(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard activities:', err);
    }
  };

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Recent Activity Feed
            </h3>
            <p className="text-xs text-slate-400">Live project updates across team workspace</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/activities')}
          className="text-xs text-amber-400 font-semibold cursor-pointer hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">No recent activity recorded</div>
        ) : (
          list.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-all duration-200 space-x-3"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {item.userAvatar || 'U'}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200 truncate">{item.userName}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">{item.activity}</p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1 shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/20">
                  {item.statusBadge || 'Event'}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.timeAgo || 'Recently'}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
