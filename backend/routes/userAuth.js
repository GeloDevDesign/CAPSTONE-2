import express from 'express';
import userAuthController from '../controller/userAuthController.js';

const router = express.Router();

router.post('/forgot-password', userAuthController.forgotPassword);
router.post('/verify-otp', userAuthController.verifyOTP);
router.post('/reset-password', userAuthController.resetPassword);

export default router;