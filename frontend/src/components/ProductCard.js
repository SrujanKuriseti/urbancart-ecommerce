import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/HeroBanner';
import Modal from '../components/Modal';
import { useState } from 'react';
import { useCart } from '../context/CartContext';


const ProductCard = ({ product, onQuickView }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const result = await addToCartContext(product, 1);

    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div style={styles.card} onClick={handleViewDetails}
      onMouseOver={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(44,62,88,.15)';
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.boxShadow = '0 3px 16px rgba(60,80,140,0.13)';
        e.currentTarget.style.transform = 'scale(1.0)';
      }}>
      <div style={styles.imageContainer}>
        <img
          src={product.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={product.name}
          style={{
            ...styles.image,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity .35s cubic-bezier(.77,0,.18,1)'
          }}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Product flags */}
        {product.isNew && (
          <span style={{
            position: 'absolute', top: 10, left: 10, background: '#27ae60',
            color: '#fff', borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem', fontWeight: 700
          }}>NEW</span>
        )}
        {product.sale && (
          <span style={{
            position: 'absolute', top: 10, left: 80, background: '#d7263d',
            color: '#fff', borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem', fontWeight: 700
          }}>SALE</span>
        )}
        {/* Stock badges */}
        {product.quantity < 10 && product.quantity > 0 && (
          <span style={styles.stockWarning}>Only {product.quantity} left!</span>
        )}
        {product.quantity === 0 && <span style={styles.outOfStock}>Out of Stock</span>}
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.brand}>{product.brand}</p>
        <p style={styles.category}>{product.category}</p>
        <p style={styles.price}>{formatPrice(product.price)}</p>

        <button
          style={product.quantity === 0 ? styles.btnDisabled : styles.btn}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        {onQuickView && (
          <button
            onClick={e => { e.stopPropagation(); onQuickView(product); }}
            style={{
              marginTop: 8,
              background: 'linear-gradient(90deg, #5f27cd 0%, #01a3a4 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.6rem',
              width: '100%',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Quick View
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 3px 16px rgba(60, 80, 140, 0.13)',
    transition: 'box-shadow .18s, transform .18s',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '240px',
    maxWidth: '100%',
    height: 'auto',
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  stockWarning: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  outOfStock: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  info: {
    padding: '1rem',
  },
  name: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  brand: {
    margin: '0 0 0.25rem 0',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  category: {
    margin: '0 0 0.5rem 0',
    color: '#95a5a6',
    fontSize: '0.85rem',
  },
  price: {
    margin: '0 0 1rem 0',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: 'linear-gradient(90deg, #5f27cd 0%, #01a3a4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '7px',
    fontSize: '1.09rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 10px #adcaed25',
    letterSpacing: '.5px',
    cursor: 'pointer',
    transition: 'background .19s, color .19s, transform .14s'
  },
  btnDisabled: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '1rem',
  },
};

export default ProductCard;
