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

## 🤖 AI Behavioral Guidelines
When working on this project, the AI should:
- **Prioritize Visuals**: If asked to build a UI, make it look expensive and modern.
- **Check Paths**: Always remember this is a monorepo. Use `--prefix` or navigate to the correct directory for commands.
- **Preserve Documentation**: Keep existing comments and docstrings.
- **SEO & Performance**: Implement best practices (Semantic HTML, Meta tags, Alt text).

## 📍 Quick Navigation
- **Routes**: `/backend/src/routes`
- **Models**: `/backend/src/models`
- **Pages**: `/frontend/src/pages`
- **Components**: `/frontend/src/components`
- **Styles**: `/frontend/src/index.css` & `/frontend/src/styles`

---
*Refer to `project-map.md` for a detailed technical breakdown.*
