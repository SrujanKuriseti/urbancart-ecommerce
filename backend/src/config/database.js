const { Pool } = require('pg');
require('dotenv').config();

// Singleton pattern for database connection
class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

      this.pool.on('error', (err) => {
        console.error('Unexpected database error:', err);
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  query(text, params) {
    return this.pool.query(text, params);
  }

  async getClient() {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }
}

// Export singleton instance
const database = new Database();
module.exports = database;
