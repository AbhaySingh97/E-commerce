import { Router } from 'express';
import * as categoryController from '../controllers/productController.js';
import * as productController from '../controllers/productController.js';
import { auth, adminOnly, vendorOrAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/categories', categoryController.getCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);
router.get('/categories/:slug/products', categoryController.getProducts);
router.post('/categories', auth, adminOnly, categoryController.createCategory);
router.patch('/categories/:id', auth, adminOnly, categoryController.updateCategory);
router.delete('/categories/:id', auth, adminOnly, categoryController.deleteCategory);

router.get('/products', productController.getProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/new-arrivals', productController.getNewArrivals);
router.get('/products/meta/filters', productController.getProductFilterMeta);
router.get('/products/:slug', productController.getProductBySlug);
router.get('/products/:slug/related', productController.getRelatedProducts);
router.post('/products', auth, vendorOrAdmin, productController.createProduct);
router.patch('/products/:id', auth, vendorOrAdmin, productController.updateProduct);
router.delete('/products/:id', auth, adminOnly, productController.deleteProduct);

router.get('/admin/products', auth, adminOnly, productController.getAllProductsForAdmin);
router.patch('/admin/products/:id/stock', auth, adminOnly, productController.updateProductStock);

export default router;
