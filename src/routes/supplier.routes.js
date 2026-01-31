import express from 'express';
import supplierController from '../controllers/supplier.controller.js';
import supplierValidator from '../validators/supplier.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.use(authenticateToken);

// Get all for current location (Staff/Admin)
router.get('/', supplierController.getAll);

// Get all for super admin
router.get(
    '/admin/all',
    authorizeRoles(USER_ROLES.SUPER_ADMIN),
    supplierController.getAllAdmin
);

router.get(
    '/:id',
    validate(supplierValidator.getById),
    supplierController.getById
);

router.post(
    '/',
    validate(supplierValidator.create),
    supplierController.create
);

router.put(
    '/:id',
    validate(supplierValidator.update),
    supplierController.update
);

router.delete(
    '/:id',
    validate(supplierValidator.delete),
    supplierController.delete
);

export default router;
