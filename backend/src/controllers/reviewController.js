// backend/src/controllers/reviewController.js
const ReviewDAO = require("../dao/ReviewDAO");
const database = require("../config/database");

const ReviewController = {
  async getItemReviews(req, res, next) {
    try {
      const { itemId } = req.params;
      const reviews = await ReviewDAO.getReviewsByItemId(itemId);

      const avg =
        reviews.length === 0
          ? 0
          : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      res.json({
        averageRating: avg,
        reviewCount: reviews.length,
        reviews,
      });
    } catch (err) {
      next(err);
    }
  },

  async submitReview(req, res, next) {
    try {
      const { itemId } = req.params;
      const userId = req.user.id;
      const { rating, reviewText } = req.body;

      const parsedRating = parseInt(rating, 10);
      if (
        !Number.isInteger(parsedRating) ||
        parsedRating < 1 ||
        parsedRating > 5
      ) {
        return res
          .status(400)
          .json({ error: "Rating must be an integer between 1 and 5" });
      }

      // find customer id from user id
      const result = await database.query(
        "SELECT id FROM customers WHERE user_id = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Customer profile not found" });
      }
      const customerId = result.rows[0].id;

      // Use ReviewDAO to insert
      const review = await ReviewDAO.upsertReview(
        itemId,
        customerId,
        parsedRating,
        reviewText || ""
      );

      res.json({ message: "Review saved", review });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ReviewController;
