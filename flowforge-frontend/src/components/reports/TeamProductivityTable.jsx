import React from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';

/**
 * Team Productivity Table Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders individual user output, completion rates, and assigned workload metrics from live database queries.
 */
export const TeamProductivityTable = ({ userPerformance }) => {
  if (!userPerformance || userPerformance.length === 0) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 shadow-xl">
        <Users className="w-10 h-10 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Team Members Found</h3>
        <p className="text-xs text-slate-400">Register user accounts to view team performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span>Team & Contributor Productivity</span>
            <Users className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Individual engineer output, completed tasks, and completion velocity</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Engineer / User</th>
              <th className="py-3.5 px-4">Assigned Tasks</th>
              <th className="py-3.5 px-4">Completed Tasks</th>
              <th className="py-3.5 px-4">Pending Backlog</th>
              <th className="py-3.5 px-4">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {userPerformance.map((user) => (
              <tr key={user.userId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                      {user.userAvatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">{user.userName}</div>
                      <div className="text-[11px] text-slate-400">{user.userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-200">{user.assignedTasks}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{user.completedTasks}</td>
                <td className="py-3.5 px-4 text-slate-400">{user.pendingTasks}</td>
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-amber-400">{user.completionRate}%</span>
                    </div>
                    <div className="w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${user.completionRate}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamProductivityTable;
