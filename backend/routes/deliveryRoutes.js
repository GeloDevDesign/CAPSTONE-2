import express from 'express';

import deliveryController from '../controller/deliveryController.js';
import { authenticateToken } from "../Utils/authMiddleware.js";

const router = express.Router();

router.patch('/deliveryUpdate/:id', authenticateToken,deliveryController.deliveryUpdate);
router.patch('/insertDeliveryItems', authenticateToken,deliveryController.insertDeliveryItems);
router.patch('/deliveryCompleted/:id',authenticateToken,deliveryController.deliveryCompleted);
router.patch('/raw/:id',authenticateToken,deliveryController.deliveryUpdateRaw);

router.patch('/deliveryCompletedRaw/:id',authenticateToken,deliveryController.deliveryCompletedRaw);

export default router;