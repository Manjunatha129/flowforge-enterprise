import api from './api';

/**
 * Global Search Service Client.
 * 
 * WHY THIS SERVICE EXISTS:
 * Handles workspace-wide search queries across Projects, Tasks, Messages, Comments, Files, and Users.
 */
export const searchService = {
  // Execute Global Search
  searchGlobal: async (query) => {
    const response = await api.get(`/search/global?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};

export default searchService;
