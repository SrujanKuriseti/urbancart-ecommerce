const CatalogService = require('../services/catalogService');
const database = require('../config/database');

class CatalogController {
  async getAllItems(req, res, next) {
    try {
      const items = await CatalogService.getAllItems();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const { id } = req.params;
      const item = await CatalogService.getItemById(id);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async filterAndSort(req, res, next) {
    try {
      const { category, brand, search, sortBy, order } = req.query;
      const items = await CatalogService.filterAndSort({
        category,
        brand,
        search,
        sortBy,
        order
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async createItem(req, res, next) {
    try {
      const item = await CatalogService.createItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const item = await CatalogService.updateItem(id, req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      await CatalogService.deleteItem(id);
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateInventory(req, res, next) {
  try {
    const { itemId } = req.params; // <-- itemId will be "TECH002"
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    // THIS LINE is the fix:
    const result = await database.query(
      'UPDATE items SET quantity = $1 WHERE item_id = $2 RETURNING *',
      [quantity, itemId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Inventory updated', item: result.rows[0] });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new CatalogController();
