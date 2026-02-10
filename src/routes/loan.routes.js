import express from 'express';
import loanController from '../controllers/loan.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', loanController.create);
router.put('/:id', loanController.update);
router.delete('/:id', loanController.delete);
router.get('/purchase/:purchaseId', loanController.getByPurchase);

export default router;
