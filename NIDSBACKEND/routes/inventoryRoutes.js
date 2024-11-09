// routes/productRoutes.js
import express from 'express';
import inventoryController from '../controller/inventoryController.js';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../Utils/authMiddleware.js';

// Import Multer config and logging from utils
import upload from '../Utils/multerConfig.js';
import logRequest from '../Utils/logRequest.js';

const router = express.Router();

// Validation middlewares
const validateAddItemToInventory = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('price_1').isNumeric().withMessage('Price 1 must be a number'),
  body('price_2').isNumeric().withMessage('Price 2 must be a number'),
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('stock_1').isNumeric().withMessage('Stock 1 must be a number'),
  body('expiration_1').optional().isString().withMessage('Expiration 1 must be a string'),
  body('expiration_2').optional().isString().withMessage('Expiration 2 must be a string'),
  body('maximum_quantity').isNumeric().withMessage('Maximum quantity must be a number'),
  body('reordering_point').isNumeric().withMessage('Reordering point must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Routes
router.get('/products',authenticateToken,inventoryController.getProducts);
router.post('/products',authenticateToken,upload.single('image-inventory'), validateAddItemToInventory, inventoryController.addProduct);
router.patch('/products/:id',authenticateToken,logRequest, inventoryController.updateProduct);
router.patch('/products',authenticateToken,logRequest, inventoryController.updateStock);
router.patch('/swapItem',authenticateToken,inventoryController.swapItem);

export default router;
