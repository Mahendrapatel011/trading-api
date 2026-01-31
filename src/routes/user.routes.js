import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create user - super admin only
router.post(
  '/',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  userController.create
);

// Get all users
router.get(
  '/',
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  userController.getAll
);

// Get user by ID
router.get(
  '/:id',
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  userController.getById
);

// Update user
router.put(
  '/:id',
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  userController.update
);

// Delete user
router.delete(
  '/:id',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  userController.delete
);

export default router;

