import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/products/:slug/reviews', reviewController.getProductReviews);
router.post('/products/:slug/reviews', auth, reviewController.createReview);
router.patch('/reviews/:id', auth, reviewController.updateReview);
router.delete('/reviews/:id', auth, reviewController.deleteReview);
router.post('/reviews/:id/helpful', reviewController.markHelpful);
router.get('/products/:slug/rating-summary', reviewController.getRatingSummary);

export default router;
