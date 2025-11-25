import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart: removeFromCartContext, loadCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      await loadCart();
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    const result = await updateQuantity(itemId, quantity);
    if (!result.success) {
      alert(result.error || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      const result = await removeFromCartContext(itemId);
      if (!result.success) {
        alert(result.error || 'Failed to remove item');
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your cart...</p>
      </div>
    );
  }


  if (!cart || cart.items.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          {/* Shopping Cart Icon */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#cbd5e0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '1.5rem' }}
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>

          <h2 style={styles.emptyTitle}>Your Cart is Empty</h2>
          <p style={styles.emptyText}>
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>

          <button onClick={() => navigate('/')} style={styles.continueShoppingBtn}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '8px' }}
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }


  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <p style={styles.subtitle}>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div style={styles.cartLayout}>
        {/* Cart Items */}
        <div style={styles.itemsSection}>
          {cart.items.map((item) => (
            <div key={item.item_id} style={styles.item}>
              <img src={item.image_url} alt={item.name} style={styles.image} />

              <div style={styles.details}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.brand}>{item.brand}</p>
                <p style={styles.price}>{formatPrice(item.price)}</p>
              </div>

              <div style={styles.quantitySection}>
                <label style={styles.quantityLabel}>Quantity</label>
                <div style={styles.quantityControls}>
                  <button
                    onClick={() => handleUpdateQuantity(item.item_id, item.quantity - 1)}
                    style={styles.qtyBtn}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span style={styles.qtyText}>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.item_id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={styles.itemTotal}>
                <p style={styles.totalLabel}>Total</p>
                <p style={styles.totalPrice}>{formatPrice(item.price * item.quantity)}</p>
              </div>

              <button
                onClick={() => handleRemoveItem(item.item_id)}
                style={styles.removeBtn}
                aria-label="Remove item"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}

          <button onClick={() => navigate('/')} style={styles.continueShoppingLink}>
            ← Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div style={styles.summarySection}>
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryRows}>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={styles.freeText}>FREE</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax</span>
                <span>{formatPrice(cart.total * 0.1)}</span>
              </div>
            </div>

            <div style={styles.summaryDivider}></div>

            <div style={styles.summaryTotal}>
              <span style={styles.totalText}>Total</span>
              <span style={styles.totalAmount}>{formatPrice(cart.total * 1.1)}</span>
            </div>

            <button onClick={handleCheckout} style={styles.checkoutBtn}>
              Proceed to Checkout
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginLeft: '8px' }}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <div style={styles.secureNote}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: '6px' }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure Checkout
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
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '2rem',
  },
  emptyCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '4rem 3rem',
    textAlign: 'center',
    maxWidth: '500px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.05rem',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  continueShoppingBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
  },
  cartLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    alignItems: 'start',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    transition: 'box-shadow 0.2s',
  },
  image: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  brand: {
    color: '#64748b',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#667eea',
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#f1f5f9',
    padding: '0.5rem',
    borderRadius: '10px',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    background: '#fff',
    color: '#667eea',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  qtyText: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  itemTotal: {
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '0.25rem',
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  removeBtn: {
    width: '40px',
    height: '40px',
    border: 'none',
    background: '#fee2e2',
    color: '#dc2626',
    cursor: 'pointer',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  continueShoppingLink: {
    background: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '1rem',
    textAlign: 'center',
  },
  summarySection: {
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
  summaryRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    color: '#64748b',
  },
  freeText: {
    color: '#10b981',
    fontWeight: '600',
  },
  summaryDivider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '1.5rem 0',
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
  checkoutBtn: {
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
  secureNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: '0.9rem',
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

export default Cart;