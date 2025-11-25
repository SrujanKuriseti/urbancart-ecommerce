import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { catalogAPI } from '../services/api';

const placeholder = "https://via.placeholder.com/400x260?text=No+Image";

const ProductDetails = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    catalogAPI.getItemById(itemId).then(res => setProduct(res.data));
  }, [itemId]);

  if (!product) return <p>Loading...</p>;

  return (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '80vh',
    background: '#f5f5f5'
  }}>
    <div style={{
      background: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 2px 16px rgba(60,60,100,0.1)',
      width: '450px',
      marginTop: '2rem'
    }}>
      <img 
        src={product.image_url || placeholder}
        alt={product.name}
        style={{
          width: '100%',
          height: 260,
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}
      />
      <h2 style={{marginBottom: 5}}>{product.name}</h2>
      <div style={{color:'#555', marginBottom: 12}}>{product.brand} &middot; {product.category}</div>
      <div style={{fontSize:'1.5rem', color: '#27ae60', fontWeight: 'bold', marginBottom: 20}}>
        ₹{parseFloat(product.price).toLocaleString('en-IN')}
      </div>
      <div style={{marginBottom:'1rem'}}><b>Description:</b><br />{product.description || "No description."}</div>
      <button style={{
        background:'#3498db',
        color:'#fff',
        border:'none',
        borderRadius:'6px',
        padding:'12px 32px',
        fontSize:'1.07rem',
        fontWeight:'bold',
        cursor:'pointer'
      }}>Add to Cart</button>
    </div>
  </div>
);
};

export default ProductDetails;
