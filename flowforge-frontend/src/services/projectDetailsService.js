import api from './api';

export const projectDetailsService = {
  async getProjectDetails(id) {
    try {
      const response = await api.get(`/projects/${id}/details`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline or endpoint unavailable. Falling back to local project details.', err);
    }
    return getFallbackProjectDetails(id);
  },

  async getActivities(id) {
    try {
      const response = await api.get(`/projects/${id}/activities`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Using fallback activities.', err);
    }
    return getFallbackProjectDetails(id).activities;
  },

  async getMembers(id) {
    try {
      const response = await api.get(`/projects/${id}/members`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Using fallback members.', err);
    }
    return getFallbackProjectDetails(id).teamMembers;
  },

  async addMember(id, memberData) {
    try {
      const response = await api.post(`/projects/${id}/members`, memberData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline. Simulating member addition.', err);
    }
    return {
      id: Date.now().toString(),
      name: memberData.name || 'New Team Member',
      avatar: (memberData.name ? memberData.name.substring(0, 2).toUpperCase() : 'TM'),
      role: memberData.role || 'Developer',
      email: memberData.email || 'member@FlowForge.dev',
    };
  },

  async removeMember(id, memberId) {
    try {
      const response = await api.delete(`/projects/${id}/members/${memberId}`);
      return response.data;
    } catch (err) {
      console.warn('Backend offline. Simulating member removal.', err);
      return { success: true };
    }
  },

  getFiles() {
    return [
      { id: 'f-1', name: 'System_Architecture_Spec_v1.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '2 days ago' },
      { id: 'f-2', name: 'Database_Schema_Diagram.png', size: '1.8 MB', type: 'Image', uploadedAt: '3 days ago' },
      { id: 'f-3', name: 'API_Contract_Specification.json', size: '420 KB', type: 'JSON', uploadedAt: '5 days ago' },
      { id: 'f-4', name: 'Sprint_3_Burndown_Report.xlsx', size: '850 KB', type: 'Spreadsheet', uploadedAt: '1 week ago' },
    ];
  },
};

function getFallbackProjectDetails(id) {
  return {
    project: {
      id: id || 'proj-1',
      projectName: 'FlowForge Cloud Platform',
      description: 'Next-generation enterprise project & task management cloud platform built with Java 21 Spring Boot microservices and React 18 frontend with Tailwind CSS.',
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
      createdBy: 'Sarah Connor',
      createdAt: '2026-07-01T10:00:00',
      updatedAt: '2026-07-22T23:10:00',
    },
    pendingTasks: 7,
    overdueTasks: 2,
    activities: [
      {
        id: 'act-1',
        activity: 'created project workspace repository',
        userName: 'Sarah Connor',
        userAvatar: 'SC',
        statusBadge: 'Created',
        timeAgo: '5d ago',
      },
      {
        id: 'act-2',
        activity: 'updated milestone target sprint due date',
        userName: 'Manju',
        userAvatar: 'MJ',
        statusBadge: 'Updated',
        timeAgo: '2d ago',
      },
      {
        id: 'act-3',
        activity: 'added new team member Rahul Verma to repository',
        userName: 'Priya Sharma',
        userAvatar: 'PS',
        statusBadge: 'Member Added',
        timeAgo: '4h ago',
      },
      {
        id: 'act-4',
        activity: 'changed status from PLANNING to ACTIVE',
        userName: 'Rahul Verma',
        userAvatar: 'RV',
        statusBadge: 'Status Changed',
        timeAgo: '1h ago',
      },
    ],
    teamMembers: [
      { id: 'mem-1', name: 'Manju', avatar: 'MJ', role: 'Engineering Director', email: 'manju@FlowForge.dev' },
      { id: 'mem-2', name: 'Rahul Verma', avatar: 'RV', role: 'Senior Full Stack Developer', email: 'rahul@FlowForge.dev' },
      { id: 'mem-3', name: 'Priya Sharma', avatar: 'PS', role: 'DevOps & Cloud Lead', email: 'priya@FlowForge.dev' },
      { id: 'mem-4', name: 'Ananya Roy', avatar: 'AR', role: 'Product Designer', email: 'ananya@FlowForge.dev' },
    ],
  };
}
