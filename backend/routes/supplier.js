import supplierController from "../controller/supplierController.js";
import { authenticateToken } from '../Utils/authMiddleware.js';
import express from 'express';

const router = express.Router();


router.post('/addSupplier',authenticateToken,supplierController.addSupplier);
router.get('/getSupplier',authenticateToken,supplierController.getSupplier);
router.patch('/updateSupplier/:id',authenticateToken,supplierController.updateSupplier);
router.delete('/deleteSupplier/:id',authenticateToken,supplierController.deleteSupplier);



export default router;