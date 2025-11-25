const CustomerDAO = require('../dao/CustomerDAO');
const AddressDAO = require('../dao/AddressDAO');
const database = require('../config/database');

class CustomerController {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const customer = await CustomerDAO.findByUserId(userId);
      const result = await database.query('SELECT * FROM customers WHERE user_id = $1',[userId]);
      if (req.user && req.user.role === 'admin') {
      return res.status(403).json({ error: 'Admins do not have a customer profile.' });
      }
      if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No customer profile found' });
      }
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      res.json(result.rows[0]);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const customer = await CustomerDAO.findByUserId(userId);

      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const updatedCustomer = await CustomerDAO.updateCustomer(customer.id, req.body);
      res.json({
        message: 'Profile updated successfully',
        customer: updatedCustomer
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const address = await AddressDAO.updateAddress(addressId, req.body);
      res.json({
        message: 'Address updated successfully',
        address
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      const address = await AddressDAO.createAddress(req.body);
      res.status(201).json({
        message: 'Address created successfully',
        address
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  async getAllCustomers(req, res, next) {
    try {
      const customers = await CustomerDAO.getAllCustomers();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  }

  async updateCustomer(req, res, next) {
    try {
      const { customerId } = req.params;
      const customer = await CustomerDAO.updateCustomer(customerId, req.body);
      res.json({
        message: 'Customer updated successfully',
        customer
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
