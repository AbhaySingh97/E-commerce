import { Router } from 'express';
import * as couponController from '../controllers/couponController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/validate', couponController.validateCoupon);
router.get('/', couponController.getCoupons);
router.post('/', auth, couponController.createCoupon);
router.patch('/:id', auth, couponController.updateCoupon);
router.delete('/:id', auth, couponController.deleteCoupon);
router.get('/:id/usage', auth, couponController.getCouponUsage);

export default router;
