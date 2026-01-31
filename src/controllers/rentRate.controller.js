import rentRateService from '../services/rentRate.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const rentRateController = {
  /**
   * Create rent rate
   * POST /api/rent-rates
   */
  create: asyncHandler(async (req, res) => {
    const rentRate = await rentRateService.create(req.body);
    return ApiResponse.created(res, rentRate, 'Rent rate created successfully');
  }),

  /**
   * Update rent rate
   * PUT /api/rent-rates/:id
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rentRate = await rentRateService.update(parseInt(id), req.body);
    return ApiResponse.success(res, rentRate, 'Rent rate updated successfully');
  }),

  /**
   * Delete rent rate
   * DELETE /api/rent-rates/:id
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await rentRateService.delete(parseInt(id));
    return ApiResponse.success(res, null, 'Rent rate deleted successfully');
  }),

  /**
   * Get all active rent rates
   * GET /api/rent-rates
   */
  getAll: asyncHandler(async (req, res) => {
    const rentRates = await rentRateService.getAll();
    return ApiResponse.success(res, rentRates);
  }),

  /**
   * Get all rent rates for admin (including inactive)
   * GET /api/rent-rates/admin/all
   */
  getAllAdmin: asyncHandler(async (req, res) => {
    const rentRates = await rentRateService.getAllForSuperAdmin();
    return ApiResponse.success(res, rentRates);
  }),

  /**
   * Get rent rate by ID
   * GET /api/rent-rates/:id
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const allRentRates = await rentRateService.getAllForSuperAdmin();
    const rentRate = allRentRates.find(rr => rr.id === parseInt(id));
    if (!rentRate) {
      return ApiResponse.error(res, httpStatus.NOT_FOUND, 'Rent rate not found');
    }
    return ApiResponse.success(res, rentRate);
  }),
};

export default rentRateController;

