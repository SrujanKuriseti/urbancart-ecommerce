class PaymentService {
  constructor() {
    this.requestCount = 0; // For simulation
  }

  async processPayment(paymentInfo) {
    // Simulate payment processing delay
    await this.delay(1000);

    this.requestCount++;

    // Simple simulation: Deny every 3rd request
    if (this.requestCount % 3 === 0) {
      return {
        success: false,
        message: 'Payment declined',
        transactionId: null
      };
    }

    // Additional validation
    if (!this.validateCardNumber(paymentInfo.cardNumber)) {
      return {
        success: false,
        message: 'Invalid card number',
        transactionId: null
      };
    }

    // Simulate successful payment
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      message: 'Payment approved',
      transactionId: transactionId
    };
  }

  validateCardNumber(cardNumber) {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it's 13-19 digits
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }

    // Luhn algorithm for card validation
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new PaymentService();
