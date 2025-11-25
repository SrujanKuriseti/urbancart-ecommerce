const CartService = require('../services/cartService');

class CartController {
  async getCart(req, res, next) {
    try {
      const userId = req.user.userId;
      const cart = await CartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      const userId = req.user.userId;
      const { itemId, quantity } = req.body;
      
      const result = await CartService.addToCart(userId, itemId, quantity);
      res.status(201).json({
        message: 'Item added to cart',
        result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req, res, next) {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params;
      const { quantity } = req.body;
      
      const result = await CartService.updateCartItem(userId, itemId, quantity);
      res.json({
        message: 'Cart updated',
        result
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params;
      
      await CartService.removeFromCart(userId, itemId);
      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      const userId = req.user.userId;
      await CartService.clearCart(userId);
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
