import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/admin/orders', auth, adminOnly, orderController.adminGetOrders);
router.patch('/admin/orders/:id/status', auth, adminOnly, orderController.adminUpdateOrderStatus);
router.get('/:id', auth, orderController.getOrderById);
router.post('/:id/cancel', auth, orderController.cancelOrder);
router.post('/:id/return', auth, orderController.requestReturn);

export default router;
