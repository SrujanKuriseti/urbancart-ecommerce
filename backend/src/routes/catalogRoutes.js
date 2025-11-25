const express = require('express');
const router = express.Router();
const CatalogController = require('../controllers/catalogController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/items', CatalogController.getAllItems);
router.get('/items/filter', CatalogController.filterAndSort);
router.get('/items/:id', CatalogController.getItemById);

// Admin routes
router.post('/items', 
  authenticateToken, 
  authorizeRole('admin'), 
  CatalogController.createItem
);

router.put('/items/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  CatalogController.updateItem
);

router.delete('/items/:id', 
  authenticateToken, 
  authorizeRole('admin'), 
  CatalogController.deleteItem
);

router.patch(
  '/items/:itemId/inventory',
  authenticateToken,
  authorizeRole('admin'),
  CatalogController.updateInventory
);

module.exports = router;
