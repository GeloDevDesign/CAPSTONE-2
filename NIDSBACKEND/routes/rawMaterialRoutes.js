
import rawMaterialController from "../controller/rawMaterialController.js";
import express from 'express';
import { authenticateToken } from "../Utils/authMiddleware.js";

const router = express.Router();

router.post('/addRawItems',authenticateToken,rawMaterialController.insertRawItems);
router.get('/getRawItems',authenticateToken,rawMaterialController.getRawItems);
router.patch('/updateRawItems',authenticateToken,rawMaterialController.updateRawItems);
router.patch('/addPO/:id',authenticateToken,rawMaterialController.addtoPO);
router.get('/getItemAddedToPO',authenticateToken,rawMaterialController.getItemAddedToPO);
router.patch('/update-rawitems',authenticateToken,rawMaterialController.batchUpdateRawItems);

export default router;

//INSTALL JOI AND JOI LIBRARY