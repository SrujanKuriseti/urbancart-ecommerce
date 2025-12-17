import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import { catalogAPI } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import Modal from '../components/Modal';
import '../styles/Home.css';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToProducts) {
      const section = document.getElementById('products');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.state]);  

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      const response = await catalogAPI.getAllItems();
      const items = response.data;

      setProducts(items);
      setCategories([...new Set(items.map(item => item.category))].sort());
      setBrands([...new Set(items.map(item => item.brand))].sort());
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setFilteredProducts(filtered);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowModal(true);
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <HeroBanner />
      <h1 style={styles.title} id="products">Our Products</h1>

      <FilterBar
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        sortBy={sortBy}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onBrandChange={setSelectedBrand}
        onSortChange={handleSortChange}
        onSearchChange={setSearchTerm}
      />

      {filteredProducts.length === 0 ? (
        <p style={styles.noResults}>No products found</p>
      ) : (
        <div id="products" className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={() => handleQuickView(product)} />
          ))}
        </div>
      )}

      {showModal && quickViewProduct && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 style={{ marginBottom: 14 }}>{quickViewProduct.name}</h2>
          <img
            src={quickViewProduct.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt={quickViewProduct.name}
            style={{ width: '100%', maxWidth: 360, borderRadius: 10, marginBottom: 20 }}
          />
          <div style={{ marginBottom: 12, fontSize: '1.05rem' }}>{quickViewProduct.description || 'No description.'}</div>
          <div style={{ fontWeight: 700, color: "#16a085", fontSize: '1.23rem', marginBottom: 16 }}>
            ${quickViewProduct.price}
          </div>
        </Modal>
      )}

    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    '@media (max-width: 768px)': { padding: '1rem' }
  },
  title: { 
    fontSize: '2rem', 
    marginBottom: '2rem', 
    textAlign: 'center' 
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  noResults: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
};

export default Home;
