import { Router } from 'express';
import * as couponController from '../controllers/couponController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/validate', couponController.validateCoupon);
router.get('/', couponController.getCoupons);
router.post('/', auth, adminOnly, couponController.createCoupon);
router.patch('/:id', auth, adminOnly, couponController.updateCoupon);
router.delete('/:id', auth, adminOnly, couponController.deleteCoupon);
router.get('/:id/usage', auth, adminOnly, couponController.getCouponUsage);

export default router;
