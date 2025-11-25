const database = require('../config/database');

class OrderDAO {
  constructor() {
    this.db = database;
  }

  async createOrder(customerId, totalAmount, shippingAddressId, billingAddressId) {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const result = await this.db.query(
      `INSERT INTO purchase_order 
       (order_number, customer_id, total_amount, shipping_address_id, billing_address_id, payment_status, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [orderNumber, customerId, totalAmount, shippingAddressId, billingAddressId, 'pending', 'processing']
    );
    return result.rows[0];
  }

  async addOrderItems(orderId, items) {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, item_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
          [orderId, item.item_id, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getOrderById(orderId) {
    const result = await this.db.query(
      `SELECT po.*, c.first_name, c.last_name, 
              sa.street as ship_street, sa.city as ship_city, sa.province as ship_province,
              ba.street as bill_street, ba.city as bill_city, ba.province as bill_province
       FROM purchase_order po
       JOIN customers c ON po.customer_id = c.id
       LEFT JOIN addresses sa ON po.shipping_address_id = sa.id
       LEFT JOIN addresses ba ON po.billing_address_id = ba.id
       WHERE po.id = $1`,
      [orderId]
    );
    return result.rows[0];
  }

  async getOrderItems(orderId) {
    const result = await this.db.query(
      `SELECT oi.*, i.name, i.image_url, i.brand
       FROM order_items oi
       JOIN items i ON oi.item_id = i.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result.rows;
  }

  async getCustomerOrders(customerId) {
    const result = await this.db.query(
      `SELECT * FROM purchase_order 
       WHERE customer_id = $1 
       ORDER BY order_date DESC`,
      [customerId]
    );
    return result.rows;
  }

  async getAllOrders() {
    const result = await this.db.query(
      `SELECT po.*, c.first_name, c.last_name, u.email
       FROM purchase_order po
       JOIN customers c ON po.customer_id = c.id
       JOIN users u ON c.user_id = u.id
       ORDER BY po.order_date DESC`
    );
    return result.rows;
  }

  async updateOrderStatus(orderId, status) {
    const result = await this.db.query(
      'UPDATE purchase_order SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    return result.rows[0];
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    const result = await this.db.query(
      'UPDATE purchase_order SET payment_status = $1 WHERE id = $2 RETURNING *',
      [paymentStatus, orderId]
    );
    return result.rows[0];
  }
}

module.exports = new OrderDAO();
