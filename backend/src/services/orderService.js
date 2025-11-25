const OrderDAO = require('../dao/OrderDAO');
const CartDAO = require('../dao/CartDAO');
const ItemDAO = require('../dao/ItemDAO');
const CustomerDAO = require('../dao/CustomerDAO');
const PaymentService = require('./paymentService');

class OrderService {
  async createOrder(userId, shippingAddress, billingAddress, paymentInfo) {
    // Get customer
    const customer = await CustomerDAO.findByUserId(userId);
    if (!customer) {
      throw new Error('Customer profile not found');
    }

    // Get cart items
    const cart = await CartDAO.getOrCreateCart(userId);
    const cartItems = await CartDAO.getCartItems(cart.id);
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Only ${item.stock} available`);
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Process payment (simulated)
    const paymentResult = await PaymentService.processPayment({
      amount: totalAmount,
      cardNumber: paymentInfo.cardNumber,
      cardName: paymentInfo.cardName,
      cvv: paymentInfo.cvv,
      expiryDate: paymentInfo.expiryDate
    });

    if (!paymentResult.success) {
      throw new Error('Payment authorization failed. Please try again.');
    }

    // Create order
    const order = await OrderDAO.createOrder(
      customer.id,
      totalAmount,
      shippingAddress.id,
      billingAddress.id
    );

    // Add order items
    await OrderDAO.addOrderItems(order.id, cartItems);

    // Update inventory
    for (const item of cartItems) {
      await ItemDAO.decreaseQuantity(item.item_id, item.quantity);
    }

    // Update payment status
    await OrderDAO.updatePaymentStatus(order.id, 'approved');

    // Clear cart
    await CartDAO.clearCart(cart.id);

    return order;
  }

  async getOrderDetails(orderId) {
    const order = await OrderDAO.getOrderById(orderId);
    const items = await OrderDAO.getOrderItems(orderId);
    
    return { ...order, items };
  }

  async getCustomerOrders(userId) {
    const customer = await CustomerDAO.findByUserId(userId);
    return await OrderDAO.getCustomerOrders(customer.id);
  }

  async getAllOrders() {
    return await OrderDAO.getAllOrders();
  }

  async updateOrderStatus(orderId, status) {
    return await OrderDAO.updateOrderStatus(orderId, status);
  }
}

module.exports = new OrderService();
