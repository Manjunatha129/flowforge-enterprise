export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://flowforge-enterprise.onrender.com/api/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'flowforge_auth_token',
  USER_DATA: 'flowforge_user_data',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  SETTINGS: '/settings',
};
