import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Home as HomeIcon } from 'react-feather';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span role="img" aria-label="cart" style={{ fontSize: '2.2rem', marginRight: 7 }}>🛒</span>
          <span>
            Urban
            <span style={{ color: '#18dcff', marginLeft: 2, fontWeight: 900 }}>
              Cart
            </span>
          </span>
        </Link>

        <ul style={styles.menu}>
          {/* Home - Always visible */}
          <li style={styles.menuItem}>
            <Link to="/" style={styles.link}>
              <HomeIcon size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />
              Home
            </Link>
          </li>

          {/* Cart - Always visible */}
          <li style={styles.menuItem}>
            <Link to="/cart" style={styles.link}>
              <ShoppingCart size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />
              Cart {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
          </li>

          {isAuthenticated() ? (
            <>
              <li style={styles.menuItem}>
                <Link to="/orders" style={styles.link}>Orders</Link>
              </li>
              <li style={styles.menuItem}>
                <Link to="/profile" style={styles.link}>
                  <User size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                  Profile
                </Link>
              </li>
              {isAdmin() && (
                <li style={styles.menuItem}>
                  <Link to="/admin" style={styles.link}>Admin</Link>
                </li>
              )}
              <li style={styles.menuItem}>
                <button onClick={handleLogout} style={styles.btnLink}>
                  <LogOut size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li style={styles.menuItem}>
                <Link to="/login" style={styles.link}>
                  <User size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                  Login
                </Link>
              </li>
              <li style={styles.menuItem}>
                <Link to="/register" style={styles.link}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    background: 'linear-gradient(90deg, #22253e 0%, #3a4165 100%)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '1.7rem',
    fontWeight: '800',
    letterSpacing: '1.5px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 9
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '2rem',
    alignItems: 'center',
  },
  menuItem: {
    position: 'relative',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  btnLink: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  badge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    padding: '0.2rem 0.5rem',
    fontSize: '0.8rem',
    marginLeft: '0.5rem',
  },
};

export default Navbar;
