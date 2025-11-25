const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', CartController.getCart);
router.post('/items', CartController.addToCart);
router.put('/items/:itemId', CartController.updateCartItem);
router.delete('/items/:itemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

module.exports = router;
