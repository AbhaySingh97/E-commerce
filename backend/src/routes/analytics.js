import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/sales', auth, analyticsController.getSalesAnalytics);
router.get('/top-products', auth, analyticsController.getTopProducts);
router.get('/dashboard', auth, analyticsController.getDashboardStats);

export default router;
