import api from './api';

export const projectService = {
  async getAllProjects(sortBy = 'createdAt') {
    try {
      const response = await api.get(`/projects?sortBy=${sortBy}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline or endpoint unavailable. Using local project fallback data.', err);
    }
    return getFallbackProjects();
  },

  async getProjectById(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Fetching fallback project by ID.', err);
    }
    return getFallbackProjects().find((p) => p.id === id) || getFallbackProjects()[0];
  },

  async createProject(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Simulating project creation.', err);
    }
    return {
      id: Date.now().toString(),
      ...projectData,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      remainingTasks: 0,
      createdAt: new Date().toISOString(),
    };
  },

  async updateProject(id, projectData) {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Simulating project update.', err);
    }
    return { id, ...projectData };
  },

  async deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Backend offline. Simulating project deletion.', err);
      return { success: true };
    }
  },

  async getProjectStats() {
    try {
      const response = await api.get('/projects/stats');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Using fallback stats.', err);
    }
    return {
      totalProjects: 4,
      activeProjects: 2,
      completedProjects: 1,
      archivedProjects: 0,
    };
  },
};

function getFallbackProjects() {
  return [
    {
      id: 'proj-1',
      projectName: 'FlowForge Cloud Platform',
      description: 'Next-generation enterprise project & task management cloud platform built with Java 21 Spring Boot and React 18.',
      category: 'Engineering',
      status: 'ACTIVE',
      priority: 'HIGH',
      projectColor: '#0c93e7',
      startDate: '2026-07-01',
      dueDate: '2026-08-15',
      progress: 84,
      totalTasks: 45,
      completedTasks: 38,
      remainingTasks: 7,
      members: ['SC', 'AC', 'DM'],
      createdBy: 'Sarah Connor',
      createdAt: '2026-07-01T10:00:00',
    },
    {
      id: 'proj-2',
      projectName: 'Mobile Native Engine',
      description: 'Cross-platform iOS and Android SDK engine for offline task synchronization and real-time push notifications.',
      category: 'Mobile',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      projectColor: '#8b5cf6',
      startDate: '2026-07-05',
      dueDate: '2026-08-10',
      progress: 62,
      totalTasks: 30,
      completedTasks: 18,
      remainingTasks: 12,
      members: ['ER', 'SC'],
      createdBy: 'Elena Rostova',
      createdAt: '2026-07-05T14:30:00',
    },
    {
      id: 'proj-3',
      projectName: 'Enterprise SSO Migration',
      description: 'Migrating core authentication infrastructure to OAuth2, SAML 2.0, and Okta Single Sign-On integration.',
      category: 'Security',
      status: 'IN_REVIEW',
      priority: 'HIGH',
      projectColor: '#10b981',
      startDate: '2026-06-15',
      dueDate: '2026-07-30',
      progress: 95,
      totalTasks: 20,
      completedTasks: 19,
      remainingTasks: 1,
      members: ['DM', 'AC', 'ER', 'SC'],
      createdBy: 'David Miller',
      createdAt: '2026-06-15T09:00:00',
    },
    {
      id: 'proj-4',
      projectName: 'AI Automated Workflow Engine',
      description: 'Integrating LLM subagent automation for automatic task triage, backlog prioritization, and code review suggestions.',
      category: 'AI / ML',
      status: 'PLANNING',
      priority: 'MEDIUM',
      projectColor: '#f59e0b',
      startDate: '2026-07-20',
      dueDate: '2026-09-01',
      progress: 40,
      totalTasks: 15,
      completedTasks: 6,
      remainingTasks: 9,
      members: ['MJ', 'RV'],
      createdBy: 'Manju',
      createdAt: '2026-07-20T16:00:00',
    },
  ];
}
