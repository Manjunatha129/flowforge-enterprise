import api from './api';

/**
 * Activity Feed Frontend API Service.
 * 
 * WHY THIS MODULE EXISTS:
 * Fetches real workspace activity timeline streams (/api/v1/activities) from the Spring Boot backend.
 */
export const activityService = {
  /** Fetch workspace activity timeline */
  async getActivities() {
    const response = await api.get('/activities');
    return response.data;
  },
};
