import express from 'express';
import rentRateController from '../controllers/rentRate.controller.js';
import rentRateValidator from '../validators/rentRate.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

// Get all active - accessible to all authenticated users
router.get('/', authenticateToken, rentRateController.getAll);

// Get all for admin (including inactive) - super admin only
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), rentRateController.getAllAdmin);

// Get by ID - accessible to all authenticated users
router.get(
  '/:id',
  authenticateToken,
  validate(rentRateValidator.getById),
  rentRateController.getById
);

// Create - super admin only
router.post(
  '/',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(rentRateValidator.create),
  rentRateController.create
);

// Update - super admin only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(rentRateValidator.update),
  rentRateController.update
);

// Delete - super admin only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  validate(rentRateValidator.delete),
  rentRateController.delete
);

export default router;

