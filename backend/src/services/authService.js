const jwt = require('jsonwebtoken');
const UserDAO = require('../dao/UserDAO');
const CustomerDAO = require('../dao/CustomerDAO');

class AuthService {
  async register(email, password, firstName, lastName) {
    // Check if user exists
    const existingUser = await UserDAO.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await UserDAO.createUser(email, password);

    // Create customer profile
    const customer = await CustomerDAO.createCustomer(user.id, firstName, lastName);

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, customer, token };
  }

  async login(email, password) {
    // Find user
    const user = await UserDAO.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await UserDAO.verifyPassword(user, password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Get customer profile (if not admin)
    let customer = null;
    if (user.role === 'customer') {
      customer = await CustomerDAO.findByUserId(user.id);
    }

    // Generate token
    const token = this.generateToken(user);

    return { 
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }, 
      customer, 
      token 
    };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();
