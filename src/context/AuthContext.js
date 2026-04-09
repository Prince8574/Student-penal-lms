import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        const userData = response.data.data;
        setUser(userData);
        setIsAuthenticated(userData?.status !== 'suspended');
      } catch (error) {
        // If 403 suspended, keep user data but mark not authenticated
        if (error.response?.status === 403 && error.response?.data?.suspended) {
          setUser({ suspended: true });
          setIsAuthenticated(false);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Login failed');
      }
      
      // TEMPORARY FIX: If token is returned, save it (OTP disabled)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true, token: response.data.token };
      }
      
      // Credentials verified — OTP step handled by LoginForm
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Invalid credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...', userData);
      const response = await authAPI.register(userData);
      console.log('✅ Registration response:', response.data);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      // Don't login yet — wait for OTP verification
      // Just return success so RegisterForm can move to step 3
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      console.log('📝 Updating profile...', userData);
      const response = await userAPI.updateProfile(userData);
      console.log('✅ Profile updated:', response.data);
      
      setUser(response.data.data);
      console.log('✅ User state updated with new data');
      
      return { success: true, user: response.data.data };
    } catch (error) {
      console.error('❌ Profile update failed:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  const loginWithToken = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await authAPI.getMe();
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('token');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.data);
    } catch {}
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    loginWithToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
