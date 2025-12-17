// backend/src/controllers/customerController.js
const CustomerDAO = require("../dao/CustomerDAO");
const AddressDAO = require("../dao/AddressDAO");
const database = require("../config/database");

class CustomerController {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      if (req.user && req.user.role === "admin") {
        return res
          .status(403)
          .json({ error: "Admins do not have a customer profile." });
      }

      // Trying DAO first
      let customer = await CustomerDAO.findByUserId(userId);

      // If DAO returns nothing, fall back to direct query
      if (!customer) {
        const result = await database.query(
          "SELECT * FROM customers WHERE user_id = $1",
          [userId]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "No customer profile found" });
        }
        customer = result.rows[0];
      }

      return res.json(customer);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;

      // See if a customer row exists
      let customer = await CustomerDAO.findByUserId(userId);

      // Normalize field names from frontend
      const firstName =
        req.body.first_name || req.body.firstname || req.body.fullName || "";
      const lastName = req.body.last_name || req.body.lastname || "";
      const email = req.body.email || "";
      const phone = req.body.phone || "";
      const address =
        req.body.address ||
        req.body.shippingAddress ||
        req.body.shipping_address ||
        "";

      // If not, create one first so reviews & profile both work
      if (!customer) {
        const insertResult = await database.query(
          `INSERT INTO customers (user_id, first_name, last_name)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [userId, firstName, lastName]
        );
        customer = insertResult.rows[0];
      } else {
        // Update existing customer via DAO (it already knows real column names)
        customer = await CustomerDAO.updateCustomer(customer.id, {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
        });
      }

      return res.json({
        message: "Profile updated successfully",
        customer,
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
        message: "Address updated successfully",
        address,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      const address = await AddressDAO.createAddress(req.body);
      res.status(201).json({
        message: "Address created successfully",
        address,
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
        message: "Customer updated successfully",
        customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
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
        message: "Customer updated successfully",
        customer,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateCustomer(req, res, next) {
    try {
      const { customerId } = req.params;
      await CustomerDAO.deactivateCustomer(customerId);
      res.json({ message: "Customer deactivated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
