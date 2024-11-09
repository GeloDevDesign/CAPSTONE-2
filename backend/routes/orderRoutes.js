import orderController from "../controller/orderController.js";
import { authenticateToken } from "../Utils/authMiddleware.js";

import express from 'express';
const router = express.Router();


router.post('/transaction',authenticateToken,orderController.postTransaction);
router.get('/orders',authenticateToken,orderController.getTransaction);
router.post('/saleRemit',authenticateToken,orderController.saleRemit);
router.patch('/saleRemit/:id',authenticateToken,orderController.updateSalesRemit);
router.get('/saleRemit',authenticateToken,orderController.getSalesRemit);


export default router;
