import express from 'express';
import disposeController from "../controller/disposeController.js";
import { authenticateToken } from '../Utils/authMiddleware.js';

const router = express.Router();

router.get('/disposeCost',authenticateToken,disposeController.getMonthlyDisposeCost);



export default router