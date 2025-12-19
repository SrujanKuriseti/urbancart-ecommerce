# UrbanCart E-Commerce Platform
This guide explains how to run the  **UrbanCart**  e‑commerce app locally using the cloned GitHub repository. It covers installing dependencies, creating the database, configuring environment variables, and running both backend and frontend.​

The database schema and seed data are already included in the repo (SQL script), so the only file you must add manually is the backend  **`.env`**.
## Repository Links
- **Frontend + Backend**: https://github.com/SrujanKuriseti/urbancart-ecommerce 
- **Live Deployment**:https://urbancart-ecommerce.vercel.app/

For live deployment First enter the backend link: https://urbancart-ecommerce.vercel.app/ and it will load the backend and prints `{"error":"Route not found"}` in browser. 
Once that message shows then you can open the live link: https://urbancart-ecommerce.vercel.app/

## Admin Credentials
**Email**: `admin@store.com`  
**Password**: `admin123`

## Test accounts
Only in cloud deployment since its stored on render backend. Not for local deployment
1. 
**Email**: `smith@yu.ca`  
**Password**: `smith123`
2. 
**Email**: `smith@yu.ca`  
**Password**: `smith123`

## Valid Test Cards (Luhn algorithm)
| Card Number        | Brand        | Status        |
|--------------------|--------------|---------------|
| 4532015112830366   | Visa         | ✅ Success    |
| 4000056655665556   | Visa (debit) | ✅ Success    |
| 5555555555554444   | Mastercard   | ✅ Success    |
| 2223003122003222   | Mastercard   | ✅ Success    |
| 378282246310005    | Amex         | ✅ Success    |
| 4000000000000002   | Visa         | ❌ Card declined |

## Quick Start (Cloud Deployment)
1. **Frontend** (Vercel): Already deployed at `https://urbancart-ecommerce.vercel.app`
2. **Backend + Database** (Render): Already deployed at `https://urbancart-backend-dima.onrender.com`

## Local Development Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git (to clone the repository)
- npm (comes with Node)

### 2. Clone the repository
- git clone https://github.com/SrujanKuriseti/urbancart-ecommerce.git
- cd urbancart-ecommerce

This creates two main apps:
-   `backend/`  – Node/Express + PostgreSQL API
-   `frontend/`  – React SPA​

## 3. Database setup (PostgreSQL)

1.  Open a terminal and connect to Postgres:    
- `psql -U postgres`
    
2.  Create the database:    
- `CREATE  DATABASE ecommerce_db; `
- `\q `
4.  Load the schema and seed data:   
  -   `psql -U postgres -d ecommerce_db -f database/schema.sql`
  -   The schema file includes all tables (`users`,  `customers`,  `items`,  `orders`, etc.) and sample data including the admin account.
    
## 4. Backend configuration

### 4.1 Install backend dependencies
- `cd backend `
- `npm install` 
This installs Express, pg, bcrypt, jsonwebtoken, cors, and other backend dependencies.​

### 4.2 Create  `backend/.env`
In the  **`backend/`**  folder, create a file named  `.env`  with:

```bash
# Server
PORT=5000  
NODE_ENV=development

# Database
DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=ecommerce_db  
DB_USER=postgres  
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Frontend URL (for CORS)
FRONTEND_URL=[http://localhost:3000](http://localhost:3000)  
```


Replace  `YOUR_POSTGRES_PASSWORD`  with the actual password for the  `postgres`  user on your machine.​
The backend automatically uses these  `DB_*`  variables; no  `DATABASE_URL`  is needed for local development.

## 4.3 Start the backend

From  `backend/`:
- `npm run dev` 

You should see:
-   `Server running on port 5000`
-   `✅ Connected to PostgreSQL database`
-   `Database connected successfully`​
 
The API will be available at:
-   `http://localhost:5000/api`
     - `{"error":"Route not found"} will show up in the browser because /api itself is not a defined route; this is expected` 

To verify the API is working, call real endpoints instead, for example:
-   `http://localhost:5000/api/catalog/items`  – list products
-   `http://localhost:5000/api/auth/login`  – POST with email/password
-   `http://localhost:5000/api/cart`  – GET current cart (with token) 

## 5. Frontend configuration

### 5.1 Install frontend dependencies

Open a new terminal, then:
- `cd urbancart-ecommerce/frontend `
- `npm  install` 
- This installs React, axios, react-router, and other frontend packages.​

### 5.2 Frontend API base URL

- The frontend already uses this logic in  `src/services/api.js`:
`const  API_BASE_URL  = process.env.REACT_APP_API_URL  || 'http://localhost:5000/api';` 
- For local development you can either rely on the above default or create  `frontend/.env`:
`REACT_APP_API_URL=http://localhost:5000/api`  (This is not needed. It will work without this `.env` file)
- Now restart the frontend dev server.

### 5.3 Start the frontend
1. From  `frontend/` in terminal :
      - `npm start` 
2. React will run on
    -   `http://localhost:3000`

## 6. Default accounts

After loading the provided schema, the following users are available:​

### Admin
-   Email:  `admin@store.com`
-   Password:  `admin123`

Use this account only for accessing the  **Admin Dashboard**  (managing products, orders, and customers). Admins are not meant to place orders and do not have customer profiles.
-   The schema creates the admin account only.
-   Additional customer accounts should be created via the registration flow in the website or Manually insert extra users/customers in Postgres if you want predefined ones.

## 7. Stopping the app

-   Stop backend: press  `Ctrl + C`  in the backend terminal.
-   Stop frontend: press  `Ctrl + C`  in the frontend terminal.

## 8. Deployment Reproduction
1. **Backend (Render)**: New → PostgreSQL, New → Web Service → Connect GitHub → Root: `backend`
2. **Frontend (Vercel)**: New Project → Connect GitHub → Root: `frontend`

## 9. Features
- Customer: Browse catalog, cart/checkout, profile, order history, product reviews
- Admin: Dashboard, inventory management, PDF sales reports
- Security: JWT auth, bcrypt, parameterized SQL
