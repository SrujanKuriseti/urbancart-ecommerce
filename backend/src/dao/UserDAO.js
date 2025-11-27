const BaseDAO = require('./BaseDAO');
const bcrypt = require('bcrypt');
const database = require('../config/database');

class UserDAO extends BaseDAO {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async createUser(email, password, role = 'customer') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );
    return result.rows[0];
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash) 
  }
}

module.exports = new UserDAO();
