import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, cartController.addToCart);
router.patch('/items/:variantId', optionalAuth, cartController.updateCartItem);
router.delete('/items/:variantId', optionalAuth, cartController.removeFromCart);
router.delete('/', optionalAuth, cartController.clearCart);
router.post('/apply-coupon', optionalAuth, cartController.applyCoupon);
router.delete('/remove-coupon', optionalAuth, cartController.removeCoupon);

export default router;
