const database = require('../config/database');

class CartDAO {
  constructor() {
    this.db = database;
  }

  async getOrCreateCart(userId) {
    // Check if cart exists
    let result = await this.db.query(
      'SELECT * FROM shopping_cart WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Create new cart
      result = await this.db.query(
        'INSERT INTO shopping_cart (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
    }

    return result.rows[0];
  }

  async getCartItems(cartId) {
    const result = await this.db.query(
      `SELECT ci.id, ci.quantity, ci.added_at,
              i.id as item_id, i.name, i.price, i.image_url, i.brand, i.quantity as stock
       FROM cart_items ci
       JOIN items i ON ci.item_id = i.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    return result.rows;
  }

  async addItem(cartId, itemId, quantity) {
    // Check if item already in cart
    const existing = await this.db.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2',
      [cartId, itemId]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      const result = await this.db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND item_id = $3 RETURNING *',
        [quantity, cartId, itemId]
      );
      return result.rows[0];
    } else {
      // Add new item
      const result = await this.db.query(
        'INSERT INTO cart_items (cart_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [cartId, itemId, quantity]
      );
      return result.rows[0];
    }
  }

  async updateItemQuantity(cartId, itemId, quantity) {
    const result = await this.db.query(
      'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND item_id = $3 RETURNING *',
      [quantity, cartId, itemId]
    );
    return result.rows[0];
  }

  async removeItem(cartId, itemId) {
    const result = await this.db.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2 RETURNING *',
      [cartId, itemId]
    );
    return result.rows[0];
  }

  async clearCart(cartId) {
    await this.db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  }
}

module.exports = new CartDAO();
