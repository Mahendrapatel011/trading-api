import express from 'express';
import unitController from '../controllers/unit.controller.js';
import unitValidator from '../validators/unit.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

// Get all active (for dropdowns) - accessible to all authenticated users
router.get('/', authenticateToken, unitController.getAll);

// Get all for admin (including inactive) - super admin only
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), unitController.getAllAdmin);

// Get by ID - accessible to all authenticated users
router.get(
  '/:id',
  authenticateToken,
  validate(unitValidator.getById),
  unitController.getById
);

// Create - super admin only
router.post(
  '/',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(unitValidator.create),
  unitController.create
);

// Update - super admin only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(unitValidator.update),
  unitController.update
);

// Delete - super admin only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(unitValidator.delete),
  unitController.delete
);

export default router;

