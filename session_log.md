# Caryqel E-Commerce — Session Log

> **Session Date**: 2026-05-03 | **Branch**: `main` | **Repo**: `AbhaySingh97/E-commerce`

---

## 📋 Overview

This session covered stabilization fixes, a full build system migration, and the beginning of Phase 1 of the long-term implementation plan. The core objectives were:
1. Fix repeated Vercel deployment failures
2. Migrate from Create React App → Vite
3. Integrate TanStack React Query
4. Begin code splitting and PWA setup

---

## 🗺️ Implementation Plan (Revised)

The original plan was revised to **drop TypeScript migration** and focus instead on:
- Pure JavaScript ecosystem optimization
- Immersive commerce features (AR, 3D product previews)
- Real-time backend features (Socket.io)
- AI-driven personalization (semantic search, recommendations)

**Saved to**: `IMPLEMENTATION_PLAN.txt` in project root.

---

## 🐛 Bug Fixes

### 1. ESLint Warnings Blocking Vercel CI Build

**Error**:
```
Treating warnings as errors because process.env.CI = true.
src/mobile/pages/MobileAddressPage.jsx
  Line 2:10: 'useNavigate' is defined but never used
src/mobile/pages/MobileEditProfilePage.jsx
  Line 3:21: 'Icon' is defined but never used
  Line 9:17: 'login' is assigned a value but never used
  Line 22:13: 'res' is assigned a value but never used
```

**Fix applied**:
- `MobileAddressPage.jsx` — Removed unused `useNavigate` and `React` default imports
- `MobileEditProfilePage.jsx` — Removed unused `Icon`, `login`, and `res` variables

**Commit**: `b77951c` — *docs: add revised implementation plan and fix ESLint warnings*

---

### 2. `face-api.js` Node.js `fs` Module Error

**Error** (recurring across all 3 Vercel build attempts):
```
Module not found: Error: Can't resolve 'fs'
in '/vercel/path0/frontend/node_modules/face-api.js/build/es6/env'
```

**Root Cause**: `face-api.js` attempts to import the Node.js `fs` module which does not exist in the browser. The Webpack-based CRA bundler doesn't shim this automatically.

**Fix applied (CRA/Vercel stable)**:
Added `browser` field to `frontend/package.json` to tell Webpack to ignore these Node modules:
```json
"browser": {
  "fs": false,
  "path": false,
  "os": false
}
```

**Commit**: `c7bd5d8` — *fix: resolve face-api.js build error by shimming Node modules*

---

### 3. CSS Selector Crash in Vite/LightningCSS

**Error** (encountered during Vite build):
```
SyntaxError: [lightningcss minify] No qualified name in attribute selector: Hash("111").
.bg-[#111] { background: #111; }
```

**Root Cause**: Tailwind JIT-style utility classes (e.g., `bg-[#111]`, `bg-[#080808]`) contain `[` and `#` characters that are invalid in standard CSS class selectors. Webpack tolerated them, but Vite's LightningCSS minifier rejected them.

**Fix applied**:
- Renamed `.bg-[#111]` → `.bg-dark-1` in `mobile.css`
- Added `.bg-dark-0 { background: #080808; }` 
- Used PowerShell to replace all occurrences in `mobile/pages/*.jsx`

---

## ⚡ Phase 1.1 — Vite Migration

**From**: Create React App (`react-scripts 5.0.1`) — ~60s builds, slow HMR  
**To**: Vite 8 — **1.2s builds**, instant HMR

### Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `frontend/vite.config.js` | Created | Vite config with React plugin and `fs` shim alias |
| `frontend/index.html` | Created (root) | Vite entry HTML with `<script type="module">` |
| `frontend/src/fs-shim.js` | Created | Browser shim for `face-api.js` Node dependencies |
| `frontend/package.json` | Modified | Replaced `react-scripts` scripts with `vite` commands |

### `vite.config.js`
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'fs': path.resolve(__dirname, './src/fs-shim.js'),
    },
  },
  server: { port: 3000, open: true },
  build: { outDir: 'build' },
});
```

**Commit**: `d924157` — *feat: migrate from CRA to Vite for 10x faster builds and instant HMR*

> **Note**: Vercel deployment for this commit may require setting **Output Directory** to `build` in Project Settings.

---

## 🔄 Phase 1.2 — React Query Integration

**Installed**: `@tanstack/react-query` + `@tanstack/react-query-devtools`

### Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `frontend/src/services/queries.js` | Created | 200+ lines of React Query hooks for every API domain |
| `frontend/src/services/api.js` | Modified | Fixed `process.env.REACT_APP_*` → `import.meta.env.VITE_*` |
| `frontend/src/index.jsx` | Modified | Wrapped app with `QueryClientProvider` + devtools |

### Key Features
- **Auto-caching**: Products (2 min), Categories (10 min), Cart (always fresh)
- **Optimistic updates**: Cart add/remove update UI instantly before server confirms
- **Centralized query keys**: `queryKeys` factory prevents cache mismatches
- **Devtools**: Floating panel in development to inspect cache state

### Hook Coverage
```
useProducts()        useProduct(slug)     useFeaturedProducts()
useNewArrivals()     useRelatedProducts() useCategories()
useCart()            useAddToCart()       useRemoveFromCart()
useUpdateCartItem()  useWishlist()        useAddToWishlist()
useOrders()          useOrder(id)         useReviews()
useRatingSummary()   useProfile()         useAddresses()
```

**Commit**: `d5560ce` — *feat: add React Query with optimistic cart updates and fix Vite env vars*

> ⚠️ **Action Required**: Set `VITE_API_URL` in Vercel Environment Variables (Project Settings → Environment Variables) to point to your Render backend URL.

---

## 🔧 In Progress — Phase 1.3: Code Splitting + PWA

### Code Splitting Plan
Vite build warns: `index.js` is 2.1MB (gzip: 600KB). This is caused by Three.js, face-api.js, and framer-motion being bundled into one chunk.

**Solution**: Manual chunk splitting in `vite.config.js`:
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
        'vendor-face': ['face-api.js'],
        'vendor-motion': ['framer-motion', 'motion'],
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
      }
    }
  }
}
```

### PWA Plan
Installing `vite-plugin-pwa` (requires `--legacy-peer-deps` for Vite 8 compatibility).

Features to add:
- **Web App Manifest**: App name, icons, theme colors, `display: standalone`
- **Service Worker**: Cache-first for static assets, network-first for API calls
- **Offline fallback**: Graceful page shown when network is unavailable
- **Install prompt**: "Add to Home Screen" for mobile users

---

## 📦 Git Commit History (This Session)

| Commit | Message |
|--------|---------|
| `b77951c` | docs: add revised implementation plan and fix ESLint warnings in mobile pages |
| `c7bd5d8` | fix: resolve face-api.js build error in Vercel/CRA by shimming Node modules |
| `2436a38` | ci: trigger Vercel redeploy for Vite migration |
| `d924157` | feat: migrate from CRA to Vite for 10x faster builds and instant HMR |
| `d5560ce` | feat: add React Query with optimistic cart updates and fix Vite env vars |

---

## 🔮 Next Steps (Remaining Plan)

- [ ] **Complete Code Splitting** — Break `index.js` from 2.1MB → ~300KB initial
- [ ] **Complete PWA Setup** — Manifest, service worker, offline fallback
- [ ] **Phase 2.1** — 3D product viewer with `<model-viewer>`
- [ ] **Phase 3.1** — Socket.io for live order tracking and admin dashboard
- [ ] **Phase 4.1** — Semantic search and product recommendations

---

## ⚙️ Environment Variables Reference

| Variable | Location | Value |
|----------|----------|-------|
| `VITE_API_URL` | Vercel Env Vars | `https://your-backend.onrender.com` |
| `REACT_APP_API_URL` | Legacy (no longer used) | — |

---

*Generated: 2026-05-03 | Caryqel E-Commerce Project*
