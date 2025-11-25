require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function createAdmin() {
  try {
    // Delete existing admin if exists
    await pool.query("DELETE FROM users WHERE email = 'admin@store.com'");
    console.log('Deleted old admin (if existed)');

    // Create new admin with properly hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
      ['admin@store.com', hashedPassword, 'admin']
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@store.com');
    console.log('Password: admin123');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
