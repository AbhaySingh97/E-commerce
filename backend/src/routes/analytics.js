import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/sales', auth, adminOnly, analyticsController.getSalesAnalytics);
router.get('/top-products', auth, adminOnly, analyticsController.getTopProducts);
router.get('/dashboard', auth, adminOnly, analyticsController.getDashboardStats);

export default router;
