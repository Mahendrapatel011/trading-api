import express from 'express';
import masterController from '../controllers/master.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Master data endpoints
router.get('/chambers', authenticateToken, masterController.getChambers);
router.get('/floors', authenticateToken, masterController.getFloors);
router.get('/item-categories', authenticateToken, masterController.getItemCategories);
router.get('/items', authenticateToken, masterController.getItems);

export default router;

