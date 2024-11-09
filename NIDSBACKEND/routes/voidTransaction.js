import express from 'express';
import  voidOrders  from '../controller/voidTransactionController.js'; 
import { authenticateToken } from "../Utils/authMiddleware.js";

const router = express.Router();


router.patch('/void', authenticateToken, voidOrders.voidOrders);

export default router;
