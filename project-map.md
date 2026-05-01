# Caryqel Project Map & Architecture

This document provides a detailed technical mapping of the Caryqel codebase. Use this as a reference for file locations and architectural patterns.

## 📁 Directory Structure

### 🌐 Frontend (`/frontend`)
- `src/App.jsx`: Main entry point with React Router logic.
- `src/components/`: Reusable UI components (Navbar, Footer, ProductCard, etc.).
- `src/pages/`: Page-level components (Home, Shop, ProductDetails, Checkout, Admin, etc.).
- `src/context/`: State management for Authentication (`AuthContext`) and Shopping Cart (`CartContext`).
- `src/hooks/`: Custom React hooks for API calls and logic.
- `src/services/`: API service layers using Axios/Fetch.
- `src/styles/` & `index.css`: Styling system.
- `vercel.json`: Deployment configuration for Vercel.

### ⚙️ Backend (`/backend`)
- `src/index.js`: Server entry point and database connection.
- `src/app.js`: Express application setup, middleware, and route mounting.
- `src/models/`: Mongoose schemas (User, Product, Order, Cart, Review, etc.).
- `src/routes/`: Express router definitions.
- `src/controllers/`: Logic for handling requests and interacting with models.
- `src/middleware/`: Auth guards, error handlers, and file upload logic.
- `src/utils/`: Helper functions (Token generation, etc.).
- `render.yaml`: Blueprint for Render deployment.

## 🗃 Database Schema Highlights
- **User**: Name, email, password, role (admin/user), addresses.
- **Product**: Name, description, price, stock, category, images, reviews.
- **Order**: User reference, products, total price, payment status, shipping status.
- **Review**: Product reference, user reference, rating, comment.
- **Cart/Wishlist**: Temporary/Persistent storage for user selections.

## 🔐 Core Workflows

### Authentication
- JWT-based auth stored in `localStorage` or Cookies.
- `AuthContext` provides `user` state and `login/logout` methods.

### Checkout & Payments
1. User adds items to `CartContext`.
2. Checkout page creates an Order in the backend.
3. Razorpay script is initialized; user completes payment.
4. Backend verifies payment signature and updates Order status.

### Admin Dashboard
- CRUD operations for Products, Categories, and Orders.
- Accessible only via `isAdmin` middleware/role check.

## 🛠 Commands Reference
- **Install All**: `npm install --prefix frontend && npm install --prefix backend`
- **Run Frontend**: `npm run dev --prefix frontend`
- **Run Backend**: `npm run dev --prefix backend`
- **Seed Data**: `node backend/src/seed.js`

---
*Updated: May 2026*
