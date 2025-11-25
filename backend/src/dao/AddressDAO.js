const database = require('../config/database');

class AddressDAO {
  constructor() {
    this.db = database;
  }

  async createAddress(addressData) {
    const { street, city, province, country, postalCode, phone } = addressData;
    const result = await this.db.query(
      `INSERT INTO addresses (street, city, province, country, postal_code, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [street, city, province, country, postalCode, phone]
    );
    return result.rows[0];
  }

  async findById(addressId) {
    const result = await this.db.query(
      'SELECT * FROM addresses WHERE id = $1',
      [addressId]
    );
    return result.rows[0];
  }

  async updateAddress(addressId, addressData) {
    const { street, city, province, country, postalCode, phone } = addressData;
    const result = await this.db.query(
      `UPDATE addresses 
       SET street = COALESCE($1, street),
           city = COALESCE($2, city),
           province = COALESCE($3, province),
           country = COALESCE($4, country),
           postal_code = COALESCE($5, postal_code),
           phone = COALESCE($6, phone)
       WHERE id = $7
       RETURNING *`,
      [street, city, province, country, postalCode, phone, addressId]
    );
    return result.rows[0];
  }
}

module.exports = new AddressDAO();
