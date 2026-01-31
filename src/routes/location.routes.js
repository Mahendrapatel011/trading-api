import { Router } from 'express';
import locationController from '../controllers/location.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/locations
 * @desc    Create a new location
 * @access  Super Admin
 */
router.post(
  '/',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  locationController.create
);

/**
 * @route   GET /api/locations
 * @desc    Get all locations
 * @access  Authenticated Users
 */
router.get(
  '/',
  locationController.getAll
);

/**
 * @route   GET /api/locations/:id
 * @desc    Get location details by ID
 * @access  Authenticated Users
 */
router.get(
  '/:id',
  locationController.getById
);

/**
 * @route   PUT /api/locations/:id
 * @desc    Update location details
 * @access  Super Admin
 */
router.put(
  '/:id',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  locationController.update
);

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete a location
 * @access  Super Admin
 */
router.delete(
  '/:id',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  locationController.delete
);

export default router;
