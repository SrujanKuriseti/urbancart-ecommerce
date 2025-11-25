const OrderService = require('../services/orderService');
const AddressDAO = require('../dao/AddressDAO');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const userId = req.user.userId;
      const { shippingAddress, billingAddress, paymentInfo } = req.body;

      // Create addresses if needed
      let shippingAddr = shippingAddress;
      let billingAddr = billingAddress;

      if (!shippingAddress.id) {
        shippingAddr = await AddressDAO.createAddress(shippingAddress);
      } else {
        shippingAddr = await AddressDAO.findById(shippingAddress.id);
      }

      if (!billingAddress.id) {
        billingAddr = await AddressDAO.createAddress(billingAddress);
      } else {
        billingAddr = await AddressDAO.findById(billingAddress.id);
      }

      const order = await OrderService.createOrder(
        userId,
        shippingAddr,
        billingAddr,
        paymentInfo
      );

      res.status(201).json({
        message: 'Order created successfully',
        order
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderDetails(orderId);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerOrders(req, res, next) {
    try {
      const userId = req.user.userId;
      const orders = await OrderService.getCustomerOrders(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const order = await OrderService.updateOrderStatus(orderId, status);
      res.json({
        message: 'Order status updated',
        order
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
