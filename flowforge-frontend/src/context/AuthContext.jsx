import React, { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { authService } from '../services/authService';

/**
 * Authentication React Context.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Manages user authentication state globally across the application.
 * Prevents prop drilling by exposing user state, JWT token, login, register, and logout methods
 * to any component via the `useAuth()` custom hook.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Reactive state variables
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Side-Effect (useEffect):
   * Runs on initial app mount to rehydrate session from localStorage or validate token against /auth/me API.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (err) {
            console.error('Failed to parse cached user data', err);
          }
        }
        try {
          // Fetch fresh user profile from backend
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or backend unavailable', err);
          // Token invalid, clear local storage
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /** Login handler calling authService and updating local storage */
  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success && response.data) {
      const { token: jwtToken, user: userData } = response.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, jwtToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return userData;
    } else {
      throw new Error(response.message || 'Login failed');
    }
  }, []);

  /** Register handler */
  const register = useCallback(async (name, email, password) => {
    const response = await authService.register(name, email, password);
    if (response.success && response.data) {
      const { token: jwtToken, user: userData } = response.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, jwtToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return userData;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  }, []);

  /** Logout handler clearing authentication state */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
