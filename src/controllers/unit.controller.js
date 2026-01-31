import unitService from '../services/unit.service.js';
import messages from '../constants/messages.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const unitController = {
  /**
   * Create unit
   * POST /api/units
   */
  create: asyncHandler(async (req, res) => {
    const unit = await unitService.create(req.body);
    return ApiResponse.created(res, unit, 'Unit created successfully');
  }),

  /**
   * Update unit
   * PUT /api/units/:id
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const unit = await unitService.update(parseInt(id), req.body);
    return ApiResponse.success(res, unit, 'Unit updated successfully');
  }),

  /**
   * Delete unit
   * DELETE /api/units/:id
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await unitService.delete(parseInt(id));
    return ApiResponse.success(res, null, 'Unit deleted successfully');
  }),

  /**
   * Get all active units
   * GET /api/units
   */
  getAll: asyncHandler(async (req, res) => {
    const units = await unitService.getAll();
    return ApiResponse.success(res, units);
  }),

  /**
   * Get all units for admin (including inactive)
   * GET /api/units/admin/all
   */
  getAllAdmin: asyncHandler(async (req, res) => {
    const units = await unitService.getAllForSuperAdmin();
    return ApiResponse.success(res, units);
  }),

  /**
   * Get unit by ID
   * GET /api/units/:id
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const allUnits = await unitService.getAllForSuperAdmin();
    const unit = allUnits.find(u => u.id === parseInt(id));
    if (!unit) {
      return ApiResponse.error(res, httpStatus.NOT_FOUND, 'Unit not found');
    }
    return ApiResponse.success(res, unit);
  }),
};

export default unitController;

