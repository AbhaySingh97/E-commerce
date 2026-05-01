# Caryqel AI Instructions & Project Context

This file serves as the primary context for any AI assistant working on the **Caryqel** project. AI should read this first to understand the project's soul, standards, and architecture without re-analyzing the entire codebase.

## 🚀 Project Overview
**Caryqel** is a premium, full-stack e-commerce application built with a modern JavaScript stack. It features a high-end UI/UX, robust authentication, product management, and secure payment integration.

- **Frontend**: React (Vite) SPA, styled with custom Vanilla CSS for a premium feel.
- **Backend**: Node.js & Express API.
- **Database**: MongoDB (Mongoose).
- **Payments**: Razorpay Integration.
- **Deployment**: Vercel (Frontend) & Render (Backend).

## 🎨 Design Philosophy
- **Aesthetics First**: Every component must look "Premium" and "State-of-the-Art".
- **Typography**: Uses modern fonts (Inter, Outfit, etc.).
- **Transitions**: Smooth micro-animations and hover effects are mandatory.
- **Color Palette**: Sophisticated dark/light modes, avoiding generic colors.

## 🛠 Technical Standards
1. **Module System**: Use **ES Modules** (`import/export`) everywhere. Strictly use **JavaScript** (`.js`, `.jsx`); do not use TypeScript as the project has been migrated.
2. **Monorepo Structure**:
   - `/frontend`: React client code.
   - `/backend`: Express server code.
   - `/api`: (Optional) Serverless/Shared logic.
3. **State Management**: Uses React Context API for global state (Auth, Cart, UI).
4. **Error Handling**: 
   - Backend: Standardized JSON error responses.
   - Frontend: Graceful error states and toast notifications.
5. **Coding Style**:
   - Functional components with Hooks.
   - Descriptive variable names.
   - Minimalist logic, keeping components focused.

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
- **Authentication**: JWT-based auth stored in `localStorage` or Cookies. `AuthContext` provides `user` state and `login/logout` methods.
- **Checkout & Payments**: User adds items to `CartContext` -> Checkout creates Order -> Razorpay script initialized -> Backend verifies payment and updates Order.
- **Admin Dashboard**: CRUD operations for Products, Categories, and Orders. Accessible only via `isAdmin` middleware.

## 🤖 AI Behavioral Guidelines
When working on this project, the AI should:
- **Prioritize Visuals**: If asked to build a UI, make it look expensive and modern.
- **Check Paths**: Always remember this is a monorepo. Use `--prefix` or navigate to the correct directory for commands.
- **Preserve Documentation**: Keep existing comments and docstrings.
- **SEO & Performance**: Implement best practices (Semantic HTML, Meta tags, Alt text).

## 🛠 Commands Reference
- **Install All**: `npm install --prefix frontend && npm install --prefix backend`
- **Run Frontend**: `npm run dev --prefix frontend`
- **Run Backend**: `npm run dev --prefix backend`
- **Seed Data**: `node backend/src/seed.js`

---
*Updated: May 2026*
