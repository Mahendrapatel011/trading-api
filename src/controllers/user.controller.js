import userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';
import { USER_ROLES } from '../constants/index.js';

const userController = {
  /**
   * Create user (super admin only)
   * POST /api/users
   */
  create: asyncHandler(async (req, res) => {
    const createdBy = req.user;
    const user = await userService.create(req.body, createdBy);
    return ApiResponse.created(res, user, 'User created successfully');
  }),

  /**
   * Get all users
   * GET /api/users
   */
  getAll: asyncHandler(async (req, res) => {
    const locationId = req.locationId;
    const role = req.userRole;
    const users = await userService.getAll(locationId, role);
    return ApiResponse.success(res, users, 'Users fetched successfully');
  }),

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const locationId = req.locationId;
    const role = req.userRole;
    const user = await userService.getById(parseInt(id), locationId, role);
    return ApiResponse.success(res, user, 'User fetched successfully');
  }),

  /**
   * Update user
   * PUT /api/users/:id
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const locationId = req.locationId;
    const role = req.userRole;
    const user = await userService.update(parseInt(id), req.body, locationId, role);
    return ApiResponse.success(res, user, 'User updated successfully');
  }),

  /**
   * Delete user (soft delete)
   * DELETE /api/users/:id
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const locationId = req.locationId;
    const role = req.userRole;
    await userService.delete(parseInt(id), locationId, role);
    return ApiResponse.success(res, null, 'User deleted successfully');
  }),
};

export default userController;

