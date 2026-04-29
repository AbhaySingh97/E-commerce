import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, wishlistController.getWishlist);
router.post('/', auth, wishlistController.addToWishlist);
router.post('/create', auth, wishlistController.createWishlist);
router.delete('/:productId', auth, wishlistController.removeFromWishlist);
router.post('/move-to-cart', auth, wishlistController.moveToCart);

export default router;
