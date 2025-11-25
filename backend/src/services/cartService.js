const CartDAO = require('../dao/CartDAO');
const ItemDAO = require('../dao/ItemDAO');

class CartService {
  async getCart(userId) {
    const cart = await CartDAO.getOrCreateCart(userId);
    const items = await CartDAO.getCartItems(cart.id);
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      cart,
      items,
      total: total.toFixed(2)
    };
  }

  async addToCart(userId, itemId, quantity = 1) {
    // Validate item exists and has stock
    const item = await ItemDAO.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    
    if (item.quantity < quantity) {
      throw new Error(`Insufficient stock. Only ${item.quantity} available`);
    }

    const cart = await CartDAO.getOrCreateCart(userId);
    return await CartDAO.addItem(cart.id, itemId, quantity);
  }

  async updateCartItem(userId, itemId, quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Check stock
    const item = await ItemDAO.findById(itemId);
    if (item.quantity < quantity) {
      throw new Error(`Insufficient stock. Only ${item.quantity} available`);
    }

    const cart = await CartDAO.getOrCreateCart(userId);
    return await CartDAO.updateItemQuantity(cart.id, itemId, quantity);
  }

  async removeFromCart(userId, itemId) {
    const cart = await CartDAO.getOrCreateCart(userId);
    return await CartDAO.removeItem(cart.id, itemId);
  }

  async clearCart(userId) {
    const cart = await CartDAO.getOrCreateCart(userId);
    return await CartDAO.clearCart(cart.id);
  }
}

module.exports = new CartService();
