// backend/src/dao/CustomerDAO.js
const database = require("../config/database");

class CustomerDAO {
  constructor() {
    this.db = database;
  }

  async createCustomer(userId, firstName, lastName) {
    const result = await this.db.query(
      `INSERT INTO customers (user_id, first_name, last_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, firstName, lastName]
    );
    return result.rows[0];
  }

  async findByUserId(userId) {
    const result = await this.db.query(
      `SELECT c.*, u.email, u.role
       FROM customers c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  async findById(customerId) {
    const result = await this.db.query(
      "SELECT * FROM customers WHERE id = $1",
      [customerId]
    );
    return result.rows[0];
  }

  async updateCustomer(customerId, data) {
    const {
      first_name,
      last_name,
      credit_card_last4,
      shipping_address_id,
      billing_address_id,
    } = data;

    const result = await this.db.query(
      `UPDATE customers
       SET first_name          = COALESCE($1, first_name),
           last_name           = COALESCE($2, last_name),
           credit_card_last4   = COALESCE($3, credit_card_last4),
           shipping_address_id = COALESCE($4, shipping_address_id),
           billing_address_id  = COALESCE($5, billing_address_id),
           updated_at          = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [
        first_name,
        last_name,
        credit_card_last4,
        shipping_address_id,
        billing_address_id,
        customerId,
      ]
    );
    return result.rows[0];
  }

  async getAllCustomers() {
    const result = await this.db.query(
      `SELECT c.*, u.email, u.created_at AS user_created
       FROM customers c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  }

  async deactivateCustomer(customerId) {
    await this.db.query(
      `UPDATE users
     SET is_active = FALSE
     WHERE id = (SELECT user_id FROM customers WHERE id = $1)`,
      [customerId]
    );
  }

  async activateCustomer(customerId) {
    await this.db.query(
      `UPDATE users
     SET is_active = TRUE
     WHERE id = (SELECT user_id FROM customers WHERE id = $1)`,
      [customerId]
    );
  }
}

module.exports = new CustomerDAO();
