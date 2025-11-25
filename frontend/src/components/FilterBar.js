import React from 'react';

const FilterBar = ({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  sortBy,
  sortOrder,
  searchTerm,
  onCategoryChange,
  onBrandChange,
  onSortChange,
  onSearchChange
}) => {
  return (
    <div style={{
      maxWidth: 1120,
      margin: '2.5rem auto 2.2rem auto',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 24px 0 rgba(60,80,140,0.08)',
      padding: '2.0rem 2.2rem 1.4rem 2.2rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.3rem 2.1rem',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <label style={{ fontWeight: 'bold', color: '#222', fontSize: '1.02rem' }}>
          <span style={{ marginRight: 9, letterSpacing: 1 }}>🔍 Search</span>
          <input
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="What are you looking for?"
            style={{
              marginLeft: 8,
              fontSize: '1.07rem',
              border: 'none',
              borderBottom: '2px solid #E9E9EC',
              outline: 'none',
              padding: '8px 3px',
              width: '82%',
              background: 'transparent',
              transition: 'border 0.17s'
            }} />
        </label>
      </div>
      <div style={{ minWidth: 170 }}>
        <label style={{ fontWeight: 'bold', color: '#222', fontSize: '1.02rem' }}>
          Category
          <select
            value={selectedCategory}
            onChange={e => onCategoryChange(e.target.value)}
            style={{
              marginLeft: 12, borderRadius: 8, border: '1.3px solid #e5e7ef',
              fontSize: '.99rem', background: '#f9f9fb', height: 38, padding: '0 12px'
            }}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ minWidth: 160 }}>
        <label style={{ fontWeight: 'bold', color: '#222', fontSize: '1.02rem' }}>
          Brand
          <select
            value={selectedBrand}
            onChange={e => onBrandChange(e.target.value)}
            style={{
              marginLeft: 12, borderRadius: 8, border: '1.3px solid #e5e7ef',
              fontSize: '.99rem', background: '#f9f9fb', height: 38, padding: '0 12px'
            }}>
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ minWidth: 170 }}>
        <label style={{ fontWeight: 'bold', color: '#222', fontSize: '1.02rem' }}>
          Sort By
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={e => {
              const [newSortBy, newOrder] = e.target.value.split('-');
              onSortChange(newSortBy, newOrder);
            }}
            style={{
              marginLeft: 12, borderRadius: 8, border: '1.3px solid #e5e7ef',
              fontSize: '.99rem', background: '#f9f9fb', height: 38, padding: '0 12px'
            }}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </label>
      </div>
    </div>
  );
};

const styles = {
  filterBar: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '8px',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    fontSize: '1rem',
    minWidth: '200px',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    fontSize: '1rem',
    minWidth: '150px',
  },
};

export default FilterBar;
