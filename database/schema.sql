-- Drop existing tables (for fresh start)
DROP TABLE IF EXISTS purchase_order CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS shopping_cart CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    shipping_address_id INTEGER REFERENCES addresses(id),
    billing_address_id INTEGER REFERENCES addresses(id),
    credit_card_last4 VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items/Products table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart table
CREATE TABLE shopping_cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES shopping_cart(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, item_id)
);

-- Purchase orders table
CREATE TABLE purchase_order (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    shipping_address_id INTEGER REFERENCES addresses(id),
    billing_address_id INTEGER REFERENCES addresses(id),
    payment_status VARCHAR(50) DEFAULT 'approved',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES purchase_order(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, customer_id)
);

-- Create indexes
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_brand ON items(brand);
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_purchase_order_customer ON purchase_order(customer_id);
CREATE INDEX idx_purchase_order_date ON purchase_order(order_date);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, role) VALUES 
('admin@store.com', '$2b$10$xQZ9Y6vXK4LqN0YpD8YHxO7F5K2aW9nE3bR8cT1qL6mP4sH7jV2uS', 'admin');

-- Insert sample items
INSERT INTO items (item_id, name, description, category, brand, price, quantity, image_url) VALUES
('TECH001', 'iPhone 15 Pro', 'Latest iPhone with A17 Pro chip', 'Electronics', 'Apple', 999.99, 50, 'https://shorturl.at/Qpjgg'),
('TECH002', 'MacBook Air M2', '13-inch laptop with M2 chip', 'Electronics', 'Apple', 1199.99, 30, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
('TECH003', 'Samsung Galaxy S24', 'Android flagship phone', 'Electronics', 'Samsung', 899.99, 45, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'),
('BOOK001', 'The Little Prince', 'Classic tale for all ages', 'Books', 'Penguin', 19.99, 100, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'),
('BOOK002', 'Clean Code', 'A handbook of agile software craftsmanship', 'Books', 'Pearson', 45.99, 75, ' https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('FASH001', 'Nike Air Max', 'Comfortable running shoes', 'Fashion', 'Nike', 129.99, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('FASH002', 'Levi''s 501 Jeans', 'Classic straight fit jeans', 'Fashion', 'Levi''s', 79.99, 80, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'),
('HOME001', 'Dyson V15', 'Cordless vacuum cleaner', 'Home', 'Dyson', 649.99, 20, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400'),
('HOME002', 'KitchenAid Mixer', 'Stand mixer for baking', 'Home', 'KitchenAid', 299.99, 35, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400'),
('SPORT001', 'Yoga Mat Pro', 'Premium non-slip yoga mat', 'Sports', 'Manduka', 89.99, 90, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400');
