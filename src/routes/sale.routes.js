import express from 'express';
import saleController from '../controllers/sale.controller.js';
import saleValidator from '../validators/sale.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get all for current context (location & year)
router.get(
    '/',
    validate(saleValidator.getAll),
    saleController.getAll
);

// Get purchases with their sales (grouped)
router.get(
    '/grouped',
    saleController.getPurchasesWithSales
);

// Get available purchases (for dropdown)
router.get(
    '/available-purchases',
    saleController.getAvailablePurchases
);

// Get by ID
router.get(
    '/:id',
    validate(saleValidator.getById),
    saleController.getById
);

// Create sale
router.post(
    '/',
    validate(saleValidator.create),
    saleController.create
);

// Update sale
router.put(
    '/:id',
    validate(saleValidator.update),
    saleController.update
);

// Delete sale
router.delete(
    '/:id',
    validate(saleValidator.delete),
    saleController.delete
);

export default router;
