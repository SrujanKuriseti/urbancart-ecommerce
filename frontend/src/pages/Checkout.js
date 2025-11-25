import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart: contextCart, loadCart } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    province: '',
    country: 'Canada',
    postalCode: '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      await loadCart();
      const response = await cartAPI.getCart();
      setCart(response.data);
      if (response.data.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16));
    setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentInfo({ ...paymentInfo, expiryDate: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        shippingAddress,
        billingAddress: shippingAddress,
        paymentInfo,
      };

      const response = await orderAPI.createOrder(orderData);
      alert('Order placed successfully! 🎉');
      navigate(`/orders`);
    } catch (error) {
      alert(error.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Secure Checkout</h1>
        <p style={styles.subtitle}>Complete your order in just a few steps</p>
      </div>

      {/* Progress Steps */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${(currentStep / 2) * 100}%` }}></div>
        </div>
        <div style={styles.steps}>
          <div style={{ ...styles.step, ...(currentStep >= 1 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>1</div>
            <p style={styles.stepLabel}>Shipping</p>
          </div>
          <div style={{ ...styles.step, ...(currentStep >= 2 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>2</div>
            <p style={styles.stepLabel}>Payment</p>
          </div>
        </div>
      </div>

      <div style={styles.checkoutLayout}>
        {/* Left Column - Forms */}
        <form onSubmit={handleSubmit} style={styles.formColumn}>
          {/* Shipping Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.sectionIcon}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <h2 style={styles.sectionTitle}>Shipping Address</h2>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Street Address</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                  style={styles.input}
                  onFocus={() => setCurrentStep(1)}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  placeholder="Toronto"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                  style={styles.inputSmall}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Province</label>
                <input
                  type="text"
                  placeholder="ON"
                  value={shippingAddress.province}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                  required
                  style={styles.inputSmall}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Postal Code</label>
                <input
                  type="text"
                  placeholder="M5H 2N2"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  required
                  style={styles.inputSmall}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  placeholder="(416) 123-4567"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  required
                  style={styles.inputSmall}
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.sectionIcon}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <h2 style={styles.sectionTitle}>Payment Information</h2>
            </div>

            <div style={styles.cardLogos}>
              <span style={styles.cardLogo}>💳</span>
              <span style={styles.acceptedText}>We accept all major credit cards</span>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Card Number</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={handleCardNumberChange}
                  required
                  style={styles.input}
                  onFocus={() => setCurrentStep(2)}
                  maxLength="19"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cardholder Name</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={handleExpiryChange}
                  required
                  style={styles.inputSmall}
                  maxLength="5"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  required
                  maxLength="4"
                  style={styles.inputSmall}
                />
              </div>
            </div>

            <div style={styles.secureNote}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ marginRight: '8px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>
        </form>

        {/* Right Column - Order Summary */}
        <div style={styles.summaryColumn}>
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryItems}>
              {cart && cart.items.map((item) => (
                <div key={item.item_id} style={styles.summaryItem}>
                  <img src={item.image_url} alt={item.name} style={styles.summaryImage} />
                  <div style={styles.summaryDetails}>
                    <p style={styles.summaryItemName}>{item.name}</p>
                    <p style={styles.summaryItemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p style={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div style={styles.summaryDivider}></div>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(cart?.total || 0)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={styles.freeText}>FREE</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax (10%)</span>
              <span>{formatPrice((cart?.total || 0) * 0.1)}</span>
            </div>

            <div style={styles.summaryDivider}></div>

            <div style={styles.summaryTotal}>
              <span style={styles.totalText}>Total</span>
              <span style={styles.totalAmount}>{formatPrice((cart?.total || 0) * 1.1)}</span>
            </div>

            <button type="submit" onClick={handleSubmit} style={styles.btn} disabled={processing}>
              {processing ? (
                <>
                  <div style={styles.btnSpinner}></div>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </>
              )}
            </button>

            <div style={styles.trustBadges}>
              <div style={styles.trustBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Secure Payment</span>
              </div>
              <div style={styles.trustBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    background: '#f8fafc',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    color: '#64748b',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
  },
  progressContainer: {
    marginBottom: '3rem',
  },
  progressBar: {
    height: '4px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
  },
  steps: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '400px',
    margin: '0 auto',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.5,
    transition: 'opacity 0.3s',
  },
  stepActive: {
    opacity: 1,
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  stepLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '600',
  },
  checkoutLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    alignItems: 'start',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionIcon: {
    color: '#667eea',
    marginRight: '0.75rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
  },
  inputSmall: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  cardLogos: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  cardLogo: {
    fontSize: '1.5rem',
  },
  acceptedText: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  secureNote: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    background: '#f0fdf4',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#10b981',
    marginTop: '1rem',
  },
  summaryColumn: {
    position: 'sticky',
    top: '2rem',
  },
  summary: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  summaryItems: {
    marginBottom: '1rem',
  },
  summaryItem: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '12px',
  },
  summaryImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  summaryDetails: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  summaryItemQty: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  summaryItemPrice: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#667eea',
  },
  summaryDivider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '1.5rem 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '0.75rem',
  },
  freeText: {
    color: '#10b981',
    fontWeight: '600',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  totalText: {
    fontSize: '1.3rem',
  },
  totalAmount: {
    fontSize: '1.5rem',
    color: '#667eea',
  },
  btn: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
    marginBottom: '1rem',
  },
  btnSpinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  trustBadges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#64748b',
  },
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Ignore if already exists
}

export default Checkout;