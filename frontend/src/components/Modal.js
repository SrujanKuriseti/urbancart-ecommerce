// /src/components/Modal.js
import React from 'react';
import { useState, useEffect } from 'react';

const Modal = ({ children, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay so CSS transition runs when modal mounts
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.32s cubic-bezier(.77,0,.18,1)',
      background: 'rgba(255,255,255,0.77)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(60,80,140,0.17)',
      borderRadius: 16,
      padding: '2.5rem 2rem',
      maxWidth: 500,
      margin: '6vh auto',
      position: 'fixed',
      left: 0, right: 0, top: 0, bottom: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {children}
      <button onClick={onClose} style={{
        marginTop: 20,
        background: 'linear-gradient(90deg, #5f27cd, #01a3a4)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 700,
        fontSize: '1rem',
        cursor: 'pointer'
      }}>
        Close
      </button>
    </div>
  );
};

export default Modal;
