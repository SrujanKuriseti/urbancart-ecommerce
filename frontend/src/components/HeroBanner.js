import React from 'react';

const HeroBanner = () => (
  <div
    style={{
      width: '100%',
      minHeight: 230,
      background: 'linear-gradient(90deg, #5f27cd 0%, #01a3a4 100%)',
      borderRadius: '20px',
      margin: '2.2rem auto 2.2rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 28px 0 rgba(44,62,88,0.10)',
      maxWidth: 1170,
      padding: '0 2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
    <div style={{
      color: '#fff',
      maxWidth: 570,
      zIndex: 2
    }}>
      <h1 style={{
        fontWeight: 900,
        fontSize: '2.4rem',
        marginBottom: '16px',
        lineHeight: 1.14,
        letterSpacing: '1.4px'
      }}>
        Welcome to <span style={{
          background: 'linear-gradient(90deg,#fff 0%,#0abde3 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}>UrbanCart</span>
      </h1>
      <p style={{
        fontSize: '1.14rem',
        fontWeight: 500,
        marginBottom: 26,
        opacity: .96
      }}>
        Discover trending gadgets, fashion, and essentials—delivered fast and at the best prices!
      </p>
      <button
        onClick={() => {
          const productsSection = document.getElementById('products');
          if (productsSection) {
            productsSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }}
        style={{
          display: 'inline-block',
          background: "linear-gradient(90deg,#08d9d6 0%,#6f83fa 100%)",
          color: "white",
          padding: "0.92rem 2.1rem",
          borderRadius: "9px",
          fontWeight: 700,
          letterSpacing: "1px",
          fontSize: "1.07rem",
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 18px #56ccf253',
          transition: 'transform .15s',
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1.0)')}
      >
        Start Shopping &rarr;
      </button>

    </div>
    {/* Optional: Add a hero image or product photo at the right if you wish */}
    {/* Example: */}
    {/* 
    <img
      src="/featured-product.png"
      alt="Featured Item"
      style={{
        position:'absolute', right:40, bottom:0, height:180, opacity:0.93, zIndex:1
      }}
    />
    */}
  </div>
);

export default HeroBanner;
