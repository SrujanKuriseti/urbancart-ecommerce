const ItemDAO = require('../dao/ItemDAO');

class CatalogService {
  async getAllItems() {
    return await ItemDAO.findAll();
  }

  async getItemById(id) {
    const item = await ItemDAO.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  async getItemsByCategory(category) {
    return await ItemDAO.findByCategory(category);
  }

  async getItemsByBrand(brand) {
    return await ItemDAO.findByBrand(brand);
  }

  async searchItems(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return await ItemDAO.findAll();
    }
    return await ItemDAO.searchItems(searchTerm);
  }

  async sortItems(sortBy, order = 'asc') {
    const ascending = order.toLowerCase() === 'asc';
    
    if (sortBy === 'price') {
      return await ItemDAO.sortByPrice(ascending);
    } else if (sortBy === 'name') {
      return await ItemDAO.sortByName(ascending);
    } else {
      return await ItemDAO.findAll();
    }
  }

  async filterAndSort(filters) {
    const { category, brand, search, sortBy, order } = filters;
    
    let items;
    
    if (search) {
      items = await ItemDAO.searchItems(search);
    } else if (category) {
      items = await ItemDAO.findByCategory(category);
    } else if (brand) {
      items = await ItemDAO.findByBrand(brand);
    } else {
      items = await ItemDAO.findAll();
    }

    // Apply sorting
    if (sortBy) {
      const ascending = order?.toLowerCase() === 'asc';
      items.sort((a, b) => {
        if (sortBy === 'price') {
          return ascending ? a.price - b.price : b.price - a.price;
        } else if (sortBy === 'name') {
          return ascending 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        }
        return 0;
      });
    }

    return items;
  }

  async createItem(itemData) {
    return await ItemDAO.create(itemData);
  }

  async updateItem(id, itemData) {
    return await ItemDAO.update(id, itemData);
  }

  async deleteItem(id) {
    return await ItemDAO.delete(id);
  }

  async updateInventory(id, quantity) {
    return await ItemDAO.updateQuantity(id, quantity);
  }
}

module.exports = new CatalogService();
