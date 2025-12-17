// backend/src/dao/ReviewDAO.js
const database = require('../config/database');

class ReviewDAO {
  async getReviewsByItemId(itemId) {
    const result = await database.query(
      `SELECT r.*, c.first_name, c.last_name
       FROM reviews r
       JOIN customers c ON r.customer_id = c.id
       JOIN items i ON r.item_id = i.id
       WHERE i.item_id = $1
       ORDER BY r.created_at DESC`,
      [itemId]
    );
    return result.rows;
  }

  async upsertReview(itemId, customerId, rating, reviewText) {
    const result = await database.query(
      `INSERT INTO reviews (item_id, customer_id, rating, review_text)
       VALUES (
         (SELECT id FROM items WHERE item_id = $1),
         $2,
         $3,
         $4
       )
       ON CONFLICT (item_id, customer_id)
       DO UPDATE SET rating      = EXCLUDED.rating,
                     review_text = EXCLUDED.review_text,
                     created_at  = CURRENT_TIMESTAMP
       RETURNING *`,
      [itemId, customerId, rating, reviewText]
    );
    return result.rows[0];
  }
}

module.exports = new ReviewDAO();
