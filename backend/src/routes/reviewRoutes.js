// backend/src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

router.get('/item/:itemId', ReviewController.getItemReviews);
router.post(
  '/item/:itemId',
  authenticateToken,
  ReviewController.addOrUpdateReview
);

module.exports = router;
