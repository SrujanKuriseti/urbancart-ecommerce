const AuthService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.register(email, password, firstName, lastName);

      res.status(201).json({
        message: 'Registration successful',
        user: result.user,
        customer: result.customer,
        token: result.token
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json({
        message: 'Login successful',
        user: result.user,
        customer: result.customer,
        token: result.token
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error); // <‑‑ add this
      return res
        .status(500)
        .json({ error: error.message || 'Login failed' }); // <‑‑ and this
    }
  }

  async verifyToken(req, res) {
    // If middleware passed, token is valid
    res.json({
      valid: true,
      user: req.user
    });
  }
}

module.exports = new AuthController();
