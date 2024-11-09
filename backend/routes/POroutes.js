import POController from "../controller/POController.js";
import { authenticateToken } from "../Utils/authMiddleware.js";

import express from 'express';
const router = express.Router();


router.post('/createPO', authenticateToken,POController.addOrder);
router.get('/getPO', authenticateToken,POController.getOrdersWithItems);
router.get('/missing_quantity',authenticateToken,POController.getTotalMissingQuantity)



export default router;