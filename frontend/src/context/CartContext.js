import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  // Load cart from localStorage (guest) or API (logged in)
  const loadCart = async () => {
    if (isAuthenticated()) {
      // Load from API for logged-in users
      try {
        const response = await cartAPI.getCart();
        setCart(response.data);
        setCartCount(response.data.items.length);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    } else {
      // Load from localStorage for guests
      const guestCart = getGuestCart();
      setCart(guestCart);
      setCartCount(guestCart.items.length);
    }
  };

  // Get guest cart from localStorage
  const getGuestCart = () => {
    const stored = localStorage.getItem('guestCart');
    if (stored) {
      return JSON.parse(stored);
    }
    return { items: [], total: 0 };
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartData) => {
    localStorage.setItem('guestCart', JSON.stringify(cartData));
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated()) {
      // API call for logged-in users
      try {
        await cartAPI.addToCart(product.id, quantity);
        await loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Failed to add to cart' };
      }
    } else {
      // localStorage for guests
      const guestCart = getGuestCart();
      const existingItem = guestCart.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.items.push({
          id: product.id,
          item_id: product.item_id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          brand: product.brand,
          quantity: quantity,
        });
      }

      guestCart.total = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      saveGuestCart(guestCart);
      setCart(guestCart);
      setCartCount(guestCart.items.length);
      
      return { success: true };
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    if (isAuthenticated()) {
      try {
        await cartAPI.updateCartItem(itemId, quantity);
        await loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to update cart' };
      }
    } else {
      const guestCart = getGuestCart();
      const item = guestCart.items.find(item => item.item_id === itemId);
      
      if (item) {
        item.quantity = quantity;
        guestCart.total = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        saveGuestCart(guestCart);
        setCart(guestCart);
      }
      
      return { success: true };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (isAuthenticated()) {
      try {
        await cartAPI.removeFromCart(itemId);
        await loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to remove item' };
      }
    } else {
      const guestCart = getGuestCart();
      guestCart.items = guestCart.items.filter(item => item.item_id !== itemId);
      guestCart.total = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      saveGuestCart(guestCart);
      setCart(guestCart);
      setCartCount(guestCart.items.length);
      
      return { success: true };
    }
  };

  // Merge guest cart with user cart on login
  const mergeGuestCart = async () => {
    const guestCart = getGuestCart();
    
    if (guestCart.items.length > 0 && isAuthenticated()) {
      try {
        // Add all guest items to user's cart
        for (const item of guestCart.items) {
          await cartAPI.addToCart(item.id, item.quantity);
        }
        
        // Clear guest cart
        localStorage.removeItem('guestCart');
        
        // Reload user cart
        await loadCart();
      } catch (error) {
        console.error('Error merging cart:', error);
      }
    }
  };

  // Clear cart
  const clearCart = () => {
    localStorage.removeItem('guestCart');
    setCart({ items: [], total: 0 });
    setCartCount(0);
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    loadCart,
    mergeGuestCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
