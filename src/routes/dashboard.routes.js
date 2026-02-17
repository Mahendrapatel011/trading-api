import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/stats', authenticateToken, dashboardController.getStats);

export default router;
