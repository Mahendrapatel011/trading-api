import express from 'express';
import purchaseController from '../controllers/purchase.controller.js';
import purchaseValidator from '../validators/purchase.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.use(authenticateToken);

// Get all for current location (Staff/Admin)
router.get(
    '/',
    validate(purchaseValidator.getAll),
    purchaseController.getAll
);

// Get all for super admin
router.get(
    '/admin/all',
    authorizeRoles(USER_ROLES.SUPER_ADMIN),
    validate(purchaseValidator.getAll),
    purchaseController.getAllAdmin
);

// Generate Bill Number
router.post(
    '/generate-bill-no',
    validate(purchaseValidator.generateBillNo),
    purchaseController.generateBillNo
);

// Get by ID
router.get(
    '/:id',
    validate(purchaseValidator.getById),
    purchaseController.getById
);

// Create purchase
router.post(
    '/',
    validate(purchaseValidator.create),
    purchaseController.create
);

// Update purchase
router.put(
    '/:id',
    validate(purchaseValidator.update),
    purchaseController.update
);

// Delete purchase
router.delete(
    '/:id',
    validate(purchaseValidator.delete),
    purchaseController.delete
);

export default router;
