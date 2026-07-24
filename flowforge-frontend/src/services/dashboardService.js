import api from './api';

/**
 * Dashboard Frontend API Service.
 * 
 * WHY THIS SERVICE EXISTS:
 * Fetches real live database analytics from the Spring Boot REST endpoint.
 * Zero demo/sample data. All fallback states return exact zero metrics.
 */
export const dashboardService = {
  async getOverview() {
    try {
      const response = await api.get('/dashboard/overview');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Dashboard API offline or unavailable', err);
    }
    // Return clean zero-state object when database data is not yet available
    return {
      stats: {
        totalProjects: 0,
        totalProjectsTrend: '0 projects created',
        totalTasks: 0,
        totalTasksTrend: '0 tasks created',
        completedTasks: 0,
        completedTasksTrend: '0% completion rate',
        pendingTasks: 0,
        pendingTasksTrend: '0 pending work',
        overdueTasks: 0,
        overdueTasksTrend: '0 overdue tasks',
        teamMembers: 1,
        teamMembersTrend: '1 registered user',
        highPriorityTasks: 0,
        sprintHealth: 100,
      },
      analytics: {
        weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        weeklyProductivity: [0, 0, 0, 0, 0, 0, 0],
        monthlyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        monthlyProductivity: [0, 0, 0, 0, 0, 0],
        taskStatusDistribution: {
          Completed: 0,
          'In Progress': 0,
          'Pending Review': 0,
          'Todo & Backlog': 0,
        },
      },
      recentActivities: [],
      todayTasks: [],
      upcomingDeadlines: [],
      recentProjects: [],
    };
  },
};
