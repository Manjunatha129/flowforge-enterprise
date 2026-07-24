import api from './api';

export const taskService = {
  async getAllTasks(projectId = null, sortBy = 'createdAt') {
    try {
      const url = projectId ? `/tasks?projectId=${projectId}&sortBy=${sortBy}` : `/tasks?sortBy=${sortBy}`;
      const response = await api.get(url);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline or endpoint unavailable. Falling back to local tasks data.', err);
    }
    return getFallbackTasks();
  },

  async getTaskById(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Fetching fallback task by ID.', err);
    }
    return getFallbackTasks().find((t) => t.id === id) || getFallbackTasks()[0];
  },

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Simulating task creation.', err);
    }
    return {
      id: 'task-' + Date.now(),
      ...taskData,
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
      assignedUserAvatar: (taskData.assignedUser ? taskData.assignedUser.substring(0, 2).toUpperCase() : 'AC'),
      starred: false,
      archived: false,
      overdue: false,
      labels: taskData.labels || ['Backend'],
      subtasks: taskData.subtasks || [],
      commentsCount: 0,
      attachmentsCount: 0,
      subtasksProgress: 0,
      createdAt: new Date().toISOString(),
    };
  },

  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Simulating task update.', err);
    }
    return { id, ...taskData };
  },

  async updateTaskStatus(id, status) {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Simulating status update.', err);
    }
    return { id, status };
  },

  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Backend offline. Simulating task deletion.', err);
      return { success: true };
    }
  },

  async toggleStar(id) {
    try {
      const response = await api.patch(`/tasks/${id}/star`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Toggling star state locally.', err);
    }
    return { id };
  },

  async toggleArchive(id) {
    try {
      const response = await api.patch(`/tasks/${id}/archive`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Toggling archive state locally.', err);
    }
    return { id };
  },

  async duplicateTask(id) {
    try {
      const response = await api.post(`/tasks/${id}/duplicate`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Duplicating task locally.', err);
    }
    const original = getFallbackTasks().find((t) => t.id === id) || getFallbackTasks()[0];
    return {
      ...original,
      id: 'task-' + Date.now(),
      title: original.title + ' (Copy)',
      starred: false,
    };
  },

  async addComment(taskId, commentText, userName = 'Manju') {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { commentText, userName });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Adding comment locally.', err);
    }
    return {
      id: 'cmt-' + Date.now(),
      commentText,
      userName,
      userAvatar: userName.substring(0, 2).toUpperCase(),
      timeAgo: 'Just now',
    };
  },
};

function getFallbackTasks() {
  return [
    {
      id: 'task-1',
      title: 'Configure Spring Security 6 Stateless JWT Filter',
      description: 'Implement JwtAuthenticationFilter and WebSecurityConfig to validate bearer tokens on incoming REST endpoints.',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      startDate: '2026-07-10',
      dueDate: '2026-07-20',
      estimatedHours: 12.0,
      assignedUser: 'Manju',
      assignedUserAvatar: 'MJ',
      starred: true,
      archived: false,
      overdue: false,
      projectName: 'FlowForge Cloud Platform',
      labels: ['Backend', 'Security', 'API'],
      subtasks: [
        { id: 'st-1', title: 'Write JwtUtils claim validation', completed: true },
        { id: 'st-2', title: 'Configure SecurityFilterChain bean', completed: true },
        { id: 'st-3', title: 'Test 401 unauthorized entry point', completed: true },
      ],
      commentsCount: 3,
      attachmentsCount: 1,
      subtasksProgress: 100,
      createdAt: '2026-07-10T10:00:00',
    },
    {
      id: 'task-2',
      title: 'Build React Glassmorphism Kanban Drag & Drop Engine',
      description: 'Develop interactive Kanban Board supporting column transitions between Backlog, Todo, In Progress, Review, and Completed.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: '2026-07-18',
      dueDate: '2026-07-25',
      estimatedHours: 16.0,
      assignedUser: 'Elena Rostova',
      assignedUserAvatar: 'ER',
      starred: true,
      archived: false,
      overdue: false,
      projectName: 'FlowForge Cloud Platform',
      labels: ['UI', 'Feature', 'React'],
      subtasks: [
        { id: 'st-1', title: 'Design HTML5 Drag and Drop handlers', completed: true },
        { id: 'st-2', title: 'Animate column transitions', completed: false },
        { id: 'st-3', title: 'Persist backend API patch status', completed: false },
      ],
      commentsCount: 2,
      attachmentsCount: 2,
      subtasksProgress: 33,
      createdAt: '2026-07-18T14:30:00',
    },
    {
      id: 'task-3',
      title: 'Design MySQL Relational Schema & Hibernate Entities',
      description: 'Create JPA Entities for Project, ProjectActivity, Task, TaskComment with proper foreign key cascades.',
      status: 'REVIEW',
      priority: 'HIGH',
      startDate: '2026-07-15',
      dueDate: '2026-07-21',
      estimatedHours: 8.0,
      assignedUser: 'David Miller',
      assignedUserAvatar: 'DM',
      starred: false,
      archived: false,
      overdue: true,
      projectName: 'FlowForge Cloud Platform',
      labels: ['Database', 'Backend'],
      subtasks: [
        { id: 'st-1', title: 'Draft ER diagram specs', completed: true },
        { id: 'st-2', title: 'Add indexes to foreign keys', completed: true },
      ],
      commentsCount: 1,
      attachmentsCount: 0,
      subtasksProgress: 100,
      createdAt: '2026-07-15T09:00:00',
    },
    {
      id: 'task-4',
      title: 'Implement Subtask Checklist & Progress Indicator',
      description: 'Allow engineers to check/uncheck subtasks with real-time percentage progress bar calculation.',
      status: 'TODO',
      priority: 'MEDIUM',
      startDate: '2026-07-22',
      dueDate: '2026-07-28',
      estimatedHours: 6.0,
      assignedUser: 'Sarah Connor',
      assignedUserAvatar: 'SC',
      starred: false,
      archived: false,
      overdue: false,
      projectName: 'FlowForge Cloud Platform',
      labels: ['Feature', 'UI'],
      subtasks: [
        { id: 'st-1', title: 'Subtask check toggle state', completed: false },
        { id: 'st-2', title: 'Dynamic progress bar calculation', completed: false },
      ],
      commentsCount: 0,
      attachmentsCount: 0,
      subtasksProgress: 0,
      createdAt: '2026-07-22T11:00:00',
    },
    {
      id: 'task-5',
      title: 'Integrate LLM AI Task Automation Subagent Engine',
      description: 'Research prompt routing and background subagent dispatching for automatic code generation and bug triage.',
      status: 'BACKLOG',
      priority: 'LOW',
      startDate: '2026-07-25',
      dueDate: '2026-08-10',
      estimatedHours: 24.0,
      assignedUser: 'Rahul Verma',
      assignedUserAvatar: 'RV',
      starred: false,
      archived: false,
      overdue: false,
      projectName: 'FlowForge Cloud Platform',
      labels: ['Research', 'API'],
      subtasks: [
        { id: 'st-1', title: 'Evaluate LLM response latency', completed: false },
      ],
      commentsCount: 1,
      attachmentsCount: 1,
      subtasksProgress: 0,
      createdAt: '2026-07-20T16:00:00',
    },
  ];
}
