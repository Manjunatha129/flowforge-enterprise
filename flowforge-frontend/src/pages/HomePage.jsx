import React, { useEffect, useState } from 'react';
import { GreetingBanner } from '../components/dashboard/GreetingBanner';
import { QuickActionsPanel } from '../components/dashboard/QuickActionsPanel';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { TodayTasks } from '../components/dashboard/TodayTasks';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { RecentProjectsGrid } from '../components/dashboard/RecentProjectsGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { dashboardService } from '../services/dashboardService';
import { websocketService } from '../services/websocketService';

export const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const overview = await dashboardService.getOverview();
      setData(overview);
    } catch (err) {
      console.error('Failed to load dashboard overview', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(false);

    // Subscribe to STOMP live dashboard refresh signals
    const unsubDashboard = websocketService.onDashboardSignal(() => fetchDashboard(true));
    const unsubProject = websocketService.onProjectEvent(() => fetchDashboard(true));
    const unsubTask = websocketService.onTaskEvent(() => fetchDashboard(true));

    return () => {
      unsubDashboard();
      unsubProject();
      unsubTask();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Fetching FlowForge Dashboard analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Greeting Section Banner */}
      <GreetingBanner stats={data?.stats} />

      {/* 2. Quick Actions Shortcuts */}
      <QuickActionsPanel />

      {/* 3. 6 Statistics Counter Cards Grid */}
      <StatsGrid stats={data?.stats} />

      {/* 4. Analytics Section (Productivity Charts) */}
      <AnalyticsCharts analytics={data?.analytics} />

      {/* 5. Two-column Detailed Workspace Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <TodayTasks initialTasks={data?.todayTasks} />
          <RecentProjectsGrid projects={data?.recentProjects} />
        </div>

        <div className="space-y-8">
          <RecentActivityFeed activities={data?.recentActivities} />
          <UpcomingDeadlines deadlines={data?.upcomingDeadlines} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
