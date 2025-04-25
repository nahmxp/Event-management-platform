import { create } from 'zustand';
import axios from '../utils/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post('/users/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post('/users/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        loading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      set({ loading: true });
      const response = await axios.get('/users/profile');
      set({ user: response.data, isAuthenticated: true });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
})); 