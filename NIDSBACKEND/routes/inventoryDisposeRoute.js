import express from 'express';
import inventoryDisposeController from '../controller/inventoryDiposeController.js';
import { authenticateToken } from '../Utils/authMiddleware.js';


  const router = express.Router();

  router.get('/getInsertDisposeItem',authenticateToken ,inventoryDisposeController.getInsertDisposeItem);

  router.post('/insertDisposeItem', authenticateToken,inventoryDisposeController.insertDisposeItem);

  router.patch('/disposeItem/:id', authenticateToken,inventoryDisposeController.disposeItem);

  export default router;

