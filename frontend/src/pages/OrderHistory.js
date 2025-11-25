import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      processing: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c',
    };
    return colors[status?.toLowerCase()] || '#95a5a6';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
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

          <h2 style={styles.emptyTitle}>No Orders Yet</h2>
          <p style={styles.emptyText}>
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>

          <button onClick={() => navigate('/')} style={styles.startShoppingBtn}>
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
      <div style={styles.header}>
        <h1 style={styles.title}>Order History</h1>
        <p style={styles.subtitle}>Track and manage your orders</p>
      </div>

      <div style={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3 style={styles.orderNumber}>Order #{order.order_number}</h3>
                <p style={styles.orderDate}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ verticalAlign: 'middle', marginRight: '6px' }}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatDate(order.order_date)}
                </p>
              </div>

              <div style={{
                ...styles.statusBadge,
                background: `${getStatusColor(order.status)}22`,
                color: getStatusColor(order.status),
                border: `1.5px solid ${getStatusColor(order.status)}44`,
              }}>
                {order.status || 'Pending'}
              </div>
            </div>

            <div style={styles.orderBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Total Amount</span>
                <span style={styles.infoValue}>{formatPrice(order.total_amount)}</span>
              </div>

              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Payment Status</span>
                <span style={{
                  ...styles.paymentBadge,
                  background: order.payment_status === 'paid' ? '#27ae6022' : '#f39c1222',
                  color: order.payment_status === 'paid' ? '#27ae60' : '#f39c12',
                }}>
                  {order.payment_status || 'Approved'}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div style={styles.itemsSection}>
                  <p style={styles.itemsLabel}>Items ({order.items.length})</p>
                  <div style={styles.itemsList}>
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} style={styles.itemPill}>
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span style={styles.itemPill}>+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.orderFooter}>
              <button
                onClick={() => handleViewDetails(order)}
                style={styles.viewDetailsBtn}
              >
                View Details
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginLeft: '6px' }}
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Order Details</h2>
                <p style={styles.modalOrderNumber}>#{selectedOrder.order_number}</p>
              </div>
              <button onClick={closeModal} style={styles.closeBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Order Status */}
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Order Status</h3>
                <div style={styles.statusRow}>
                  <div style={{
                    ...styles.statusBadgeLarge,
                    background: `${getStatusColor(selectedOrder.status)}22`,
                    color: getStatusColor(selectedOrder.status),
                    border: `2px solid ${getStatusColor(selectedOrder.status)}44`,
                  }}>
                    {selectedOrder.status || 'Pending'}
                  </div>
                  <span style={styles.orderDateLarge}>{formatDate(selectedOrder.order_date)}</span>
                </div>
              </div>

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>Items ({selectedOrder.items.length})</h3>
                  <div style={styles.itemsContainer}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={styles.modalItem}>
                        <div style={styles.modalItemDetails}>
                          <p style={styles.modalItemName}>{item.name}</p>
                          <p style={styles.modalItemQty}>Quantity: {item.quantity}</p>
                        </div>
                        <p style={styles.modalItemPrice}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>Shipping Address</h3>
                  <div style={styles.addressBox}>
                    <p style={styles.addressLine}>{selectedOrder.shipping_address.street}</p>
                    <p style={styles.addressLine}>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.province}
                    </p>
                    <p style={styles.addressLine}>{selectedOrder.shipping_address.postal_code}</p>
                    <p style={styles.addressLine}>📞 {selectedOrder.shipping_address.phone}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Order Summary</h3>
                <div style={styles.summaryBox}>
                  <div style={styles.summaryRow}>
                    <span>Payment Status</span>
                    <span style={{
                      ...styles.paymentBadge,
                      background: selectedOrder.payment_status === 'paid' ? '#27ae6022' : '#f39c1222',
                      color: selectedOrder.payment_status === 'paid' ? '#27ae60' : '#f39c12',
                    }}>
                      {selectedOrder.payment_status || 'Approved'}
                    </span>
                  </div>
                  <div style={styles.summaryDivider}></div>
                  <div style={styles.summaryRow}>
                    <span style={styles.totalLabel}>Total Amount</span>
                    <span style={styles.totalValue}>{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button onClick={closeModal} style={styles.closeModalBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2.5rem',
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
  startShoppingBtn: {
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
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '1.5rem',
  },
  orderCard: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #e2e8f0',
  },
  orderHeader: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #e2e8f0',
  },
  orderNumber: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  orderDate: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderBody: {
    padding: '1.5rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  infoLabel: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
  infoValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  paymentBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemsSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  itemsLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '0.75rem',
  },
  itemsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  itemPill: {
    background: '#f1f5f9',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  orderFooter: {
    padding: '1rem 1.5rem',
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
  },
  viewDetailsBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '2rem',
  },
  modalContent: {
    background: '#fff',
    borderRadius: '20px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  modalOrderNumber: {
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transition: 'background 0.2s',
  },
  modalBody: {
    padding: '2rem',
    overflowY: 'auto',
    flex: 1,
  },
  modalSection: {
    marginBottom: '2rem',
  },
  modalSectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadgeLarge: {
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '1rem',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  orderDateLarge: {
    fontSize: '1rem',
    color: '#64748b',
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  modalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
  },
  modalItemDetails: {
    flex: 1,
  },
  modalItemName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  modalItemQty: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  modalItemPrice: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#667eea',
  },
  addressBox: {
    padding: '1.5rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  addressLine: {
    fontSize: '0.95rem',
    color: '#475569',
    marginBottom: '0.5rem',
  },
  summaryBox: {
    padding: '1.5rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '1rem',
  },
  summaryDivider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '1rem 0',
  },
  totalLabel: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#667eea',
  },
  modalFooter: {
    padding: '1.5rem 2rem',
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
  },
  closeModalBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};

// Add CSS animation for spinner
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
  // Ignore if rule already exists
}

export default OrderHistory;
