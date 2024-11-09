import express from 'express';

import returnRefund from ".././controller/returnRefundController.js";
import { authenticateToken } from '../Utils/authMiddleware.js';

const router = express.Router();


router.get('/return',authenticateToken,returnRefund.getReturn);
router.post('/return',authenticateToken,returnRefund.returnItems);

export default router;