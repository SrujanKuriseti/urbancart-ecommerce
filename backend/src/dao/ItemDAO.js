const BaseDAO = require('./BaseDAO');
const database = require('../config/database');

class ItemDAO extends BaseDAO {
  constructor() {
    super('items');
    this.db = database;
  }

  async findByCategory(category) {
    const result = await this.db.query(
      'SELECT * FROM items WHERE category = $1',
      [category]
    );
    return result.rows;
  }

  async findByBrand(brand) {
    const result = await this.db.query(
      'SELECT * FROM items WHERE brand = $1',
      [brand]
    );
    return result.rows;
  }

  async searchItems(searchTerm) {
    const result = await this.db.query(
      `SELECT * FROM items WHERE 
       name ILIKE $1 OR 
       description ILIKE $1 OR 
       category ILIKE $1 OR 
       brand ILIKE $1`,
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  async sortByPrice(ascending = true) {
    const order = ascending ? 'ASC' : 'DESC';
    const result = await this.db.query(
      `SELECT * FROM items ORDER BY price ${order}`
    );
    return result.rows;
  }

  async sortByName(ascending = true) {
    const order = ascending ? 'ASC' : 'DESC';
    const result = await this.db.query(
      `SELECT * FROM items ORDER BY name ${order}`
    );
    return result.rows;
  }

  async updateQuantity(itemId, quantity) {
    const result = await this.db.query(
      'UPDATE items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, itemId]
    );
    return result.rows[0];
  }

  async decreaseQuantity(itemId, amount) {
    const result = await this.db.query(
      'UPDATE items SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1 RETURNING *',
      [amount, itemId]
    );
    return result.rows[0];
  }
}

module.exports = new ItemDAO();
