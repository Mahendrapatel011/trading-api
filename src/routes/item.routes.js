import express from 'express';
import itemController from '../controllers/item.controller.js';
import itemValidator from '../validators/item.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

// Get all active (for dropdowns) - accessible to all authenticated users
router.get('/', authenticateToken, itemController.getAll);

// Get all for admin (including inactive) - super admin only
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), itemController.getAllAdmin);

// Get by ID - accessible to all authenticated users
router.get(
  '/:id',
  authenticateToken,
  validate(itemValidator.getById),
  itemController.getById
);

// Create - super admin only
router.post(
  '/',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(itemValidator.create),
  itemController.create
);

// Update - super admin only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(itemValidator.update),
  itemController.update
);

// Delete - super admin only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(itemValidator.delete),
  itemController.delete
);

export default router;