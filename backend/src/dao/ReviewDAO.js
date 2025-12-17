// backend/src/dao/ReviewDAO.js
const database = require('../config/database');

class ReviewDAO {
  async getReviewsByItemId(itemId) {
    const result = await database.query(
      `SELECT r.*, c.firstname, c.lastname
       FROM reviews r
       JOIN customers c ON r.customerid = c.id
       JOIN items i ON r.itemid = i.id
       WHERE i.itemid = $1
       ORDER BY r.createdat DESC`,
      [itemId]
    );
    return result.rows;
  }

  async upsertReview(itemId, customerId, rating, reviewText) {
    const result = await database.query(
      `INSERT INTO reviews (itemid, customerid, rating, reviewtext)
       VALUES (
         (SELECT id FROM items WHERE itemid = $1),
         $2,
         $3,
         $4
       )
       ON CONFLICT (itemid, customerid)
       DO UPDATE SET rating = EXCLUDED.rating,
                     reviewtext = EXCLUDED.reviewtext,
                     createdat = CURRENT_TIMESTAMP
       RETURNING *`,
      [itemId, customerId, rating, reviewText]
    );
    return result.rows[0];
  }
}

module.exports = new ReviewDAO();
