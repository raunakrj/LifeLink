import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
axios.defaults.withCredentials = true;

// Ensure API_URL doesn't end with a slash, then append /api if missing
const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  url = url.replace(/\/$/, ''); // Remove trailing slash
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

export const API_URL = getApiUrl();
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log(`[DEBUG] Attempting login for: ${email}`);
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log('[DEBUG] Login successful:', data.email);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('[ERROR] Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log(`[DEBUG] Attempting registration for: ${userData.email}`);
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('[DEBUG] Registration successful:', data.email);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('[ERROR] Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('[DEBUG] Attempting logout');
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
       console.error('[ERROR] Logout request failed:', error.message);
    }
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
