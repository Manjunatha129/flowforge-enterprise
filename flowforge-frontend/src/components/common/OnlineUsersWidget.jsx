import React, { useState, useEffect } from 'react';
import { Users, Circle, Clock } from 'lucide-react';
import { presenceService } from '../../services/presenceService';
import { websocketService } from '../../services/websocketService';

/**
 * Live Online Users & Presence Indicator Widget.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Displays active online/offline team members and updates presence indicators automatically over STOMP WebSockets.
 */
export const OnlineUsersWidget = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOnlineUsers = async () => {
    try {
      const users = await presenceService.getOnlineUsers();
      if (Array.isArray(users)) {
        setOnlineUsers(users);
      }
    } catch (err) {
      console.error('Failed to fetch online presence list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineUsers();

    // Subscribe to STOMP presence topic
    const unsubscribe = websocketService.onPresence((presenceEvent) => {
      if (!presenceEvent) return;

      setOnlineUsers((prev) => {
        const exists = prev.some((u) => u.userEmail === presenceEvent.userEmail);
        if (presenceEvent.status === 'ONLINE') {
          if (exists) {
            return prev.map((u) => (u.userEmail === presenceEvent.userEmail ? presenceEvent : u));
          } else {
            return [presenceEvent, ...prev];
          }
        } else {
          return prev.filter((u) => u.userEmail !== presenceEvent.userEmail);
        }
      });
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Online Presence</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {onlineUsers.length} Active Now
        </span>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 py-3 text-center">Loading presence...</div>
      ) : onlineUsers.length === 0 ? (
        <div className="text-xs text-slate-400 py-4 text-center space-y-1">
          <div className="font-semibold text-slate-300">You are currently online</div>
          <div className="text-[11px]">Real-time STOMP presence active</div>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {onlineUsers.map((user) => (
            <div
              key={user.userEmail}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px] border border-amber-500/30">
                    {user.userAvatar || 'U'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{user.userName || user.userEmail}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.userEmail}</div>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineUsersWidget;
