const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Customer routes
router.post('/', authenticateToken, OrderController.createOrder);
router.get('/my-orders', authenticateToken, OrderController.getCustomerOrders);
router.get('/:orderId', authenticateToken, OrderController.getOrderDetails);

// Admin routes
router.get('/', 
  authenticateToken, 
  authorizeRole('admin'), 
  OrderController.getAllOrders
);

router.patch('/:orderId/status', 
  authenticateToken, 
  authorizeRole('admin'), 
  OrderController.updateOrderStatus
);

module.exports = router;
