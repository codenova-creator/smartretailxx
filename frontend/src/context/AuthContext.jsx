import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';
import userApi from '../api/userApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('smartretailx_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('smartretailx_token') || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('smartretailx_token', token);
      localStorage.setItem('smartretailx_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartretailx_token');
      localStorage.removeItem('smartretailx_user');
    }
  }, [token, user]);

  /**
   * Log in user with email & password against the real Auth Service.
   */
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.login(email, password);
      // data: { userId, email, role, token, message, name? }
      const authenticatedUser = {
        id: data.userId,
        name: data.name || data.email?.split('@')[0] || 'Customer',
        email: data.email,
        role: data.role || 'Customer'
      };

      setUser(authenticatedUser);
      setToken(data.token);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      const message = err.friendlyMessage || 'Invalid email or password.';
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user account with the real User Service.
   */
  const register = async ({ name, email, role = 'Customer', password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const newUser = await authApi.register({ name, email, role, password });
      
      // Attempt auto-login with default credentials
      const loginAttempt = await login(email, password || 'Default@123');
      if (loginAttempt.success) {
        return { success: true, user: loginAttempt.user };
      }

      // If auto-login didn't return immediately, set user state from creation
      const createdUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || role
      };
      setUser(createdUser);
      setToken('mock_token_' + newUser.id);
      return { success: true, user: createdUser };
    } catch (err) {
      const message = err.friendlyMessage || 'Registration failed. Please check your information.';
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user and clear local state.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
    localStorage.removeItem('smartretailx_token');
    localStorage.removeItem('smartretailx_user');
  };

  /**
   * Update profile details.
   */
  const updateProfile = async (updatedData) => {
    if (!user?.id) return { success: false, error: 'User not logged in' };
    setLoading(true);
    try {
      const updated = await userApi.updateUser(user.id, updatedData);
      const merged = { ...user, ...updated };
      setUser(merged);
      return { success: true, user: merged };
    } catch (err) {
      return { success: false, error: err.friendlyMessage || 'Failed to update profile.' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role?.toLowerCase() === 'admin',
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
