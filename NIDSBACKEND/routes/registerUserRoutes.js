import express from 'express';
import registerUserController from "../controller/registerUserController.js";
import { authenticateToken } from '../Utils/authMiddleware.js';
const router = express.Router();

router.post('/register',authenticateToken,registerUserController.register);
router.post('/login',registerUserController.login);

router.get('/users',authenticateToken,registerUserController.getUser);
router.patch('/users/:id',authenticateToken,registerUserController.updateUser);

router.post('/logout',registerUserController.logout)
router.get('/isAuth', authenticateToken, registerUserController.isAuth);

export default router
