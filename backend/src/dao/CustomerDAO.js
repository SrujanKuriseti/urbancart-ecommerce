const database = require('../config/database');

class CustomerDAO {
  constructor() {
    this.db = database;
  }

  async createCustomer(userId, firstName, lastName) {
    const result = await this.db.query(
      'INSERT INTO customers (user_id, first_name, last_name) VALUES ($1, $2, $3) RETURNING *',
      [userId, firstName, lastName]
    );
    return result.rows[0];
  }

  async findByUserId(userId) {
    const result = await this.db.query(
      `SELECT c.*, u.email, u.role,
              sa.street as ship_street, sa.city as ship_city, sa.province as ship_province, sa.postal_code as ship_postal,
              ba.street as bill_street, ba.city as bill_city, ba.province as bill_province, ba.postal_code as bill_postal
       FROM customers c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN addresses sa ON c.shipping_address_id = sa.id
       LEFT JOIN addresses ba ON c.billing_address_id = ba.id
       WHERE c.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  async findById(customerId) {
    const result = await this.db.query(
      'SELECT * FROM customers WHERE id = $1',
      [customerId]
    );
    return result.rows[0];
  }

  async updateCustomer(customerId, data) {
    const { firstName, lastName, creditCardLast4, shippingAddressId, billingAddressId } = data;
    const result = await this.db.query(
      `UPDATE customers 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           credit_card_last4 = COALESCE($3, credit_card_last4),
           shipping_address_id = COALESCE($4, shipping_address_id),
           billing_address_id = COALESCE($5, billing_address_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [firstName, lastName, creditCardLast4, shippingAddressId, billingAddressId, customerId]
    );
    return result.rows[0];
  }

  async getAllCustomers() {
    const result = await this.db.query(
      `SELECT c.*, u.email, u.created_at as user_created
       FROM customers c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  }
}

module.exports = new CustomerDAO();
