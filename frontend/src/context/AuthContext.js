import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedCustomer = localStorage.getItem('customer');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, customer, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('customer', JSON.stringify(customer));

      setUser(user);
      setCustomer(customer);

      // Merge guest cart after successful registration
      await mergeGuestCartOnLogin();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };


  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, customer, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (customer) {
        localStorage.setItem('customer', JSON.stringify(customer));
      }

      setUser(user);
      setCustomer(customer);

      // Merge guest cart after successful login
      await mergeGuestCartOnLogin();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('customer');
    setUser(null);
    setCustomer(null);
  };

  const mergeGuestCartOnLogin = async () => {
    try {
      const guestCartStr = localStorage.getItem('guestCart');
      if (!guestCartStr) return; // No guest cart to merge

      const guestCart = JSON.parse(guestCartStr);
      if (!guestCart.items || guestCart.items.length === 0) return;

      // Import cartAPI here to avoid circular dependency
      const { cartAPI } = await import('../services/api');

      // Add each guest cart item to the user's cart
      for (const item of guestCart.items) {
        try {
          await cartAPI.addToCart(item.id, item.quantity);
        } catch (error) {
          console.error('Error adding item to cart:', error);
          // Continue with other items even if one fails
        }
      }

      // Clear guest cart after successful merge
      localStorage.removeItem('guestCart');
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  };


  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    customer,
    loading,
    register,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
