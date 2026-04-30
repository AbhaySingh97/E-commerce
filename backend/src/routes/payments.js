import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/initiate', auth, paymentController.initiatePayment);
router.post('/verify', auth, paymentController.verifyPayment);
router.get('/:id', auth, paymentController.getPaymentStatus);
router.post('/refund', auth, adminOnly, paymentController.initiateRefund);
router.post('/webhook/razorpay', paymentController.razorpayWebhook);

export default router;
