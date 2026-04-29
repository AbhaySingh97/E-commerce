import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getProfile);
router.patch('/me', auth, authController.updateProfile);
router.get('/me/addresses', auth, authController.getAddresses);
router.post('/me/addresses', auth, authController.addAddress);
router.patch('/me/addresses/:id', auth, authController.updateAddress);
router.delete('/me/addresses/:id', auth, authController.deleteAddress);

export default router;
