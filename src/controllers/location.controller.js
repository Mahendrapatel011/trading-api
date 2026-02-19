import locationService from '../services/location.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';
import { USER_ROLES } from '../constants/index.js';

const locationController = {
  /**
   * Create location (super admin only)
   * POST /api/locations
   */
  create: asyncHandler(async (req, res) => {
    const location = await locationService.create(req.body);
    return ApiResponse.created(res, location, 'location created successfully');
  }),

  /**
   * Get all locations
   * GET /api/locations
   */
  getAll: asyncHandler(async (req, res) => {
    const locations = await locationService.getAll();
    return ApiResponse.success(res, locations, 'locations fetched successfully');
  }),

  /**
   * Get location by ID
   * GET /api/locations/:id
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const location = await locationService.getById(parseInt(id));
    return ApiResponse.success(res, location, 'location fetched successfully');
  }),

  /**
   * Update location (super admin only)
   * PUT /api/locations/:id
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const location = await locationService.update(parseInt(id), req.body);
    return ApiResponse.success(res, location, 'location updated successfully');
  }),

  /**
   * Delete location (super admin only)
   * DELETE /api/locations/:id
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await locationService.delete(parseInt(id));
    return ApiResponse.success(res, null, 'location deleted successfully');
  }),

  /**
   * Get available years for a location
   * GET /api/locations/:id/years
   */
  getAvailableYears: asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log('--- GET Available Years ---');
    console.log('Location ID:', id);

    const years = await locationService.getAvailableYears(parseInt(id));
    console.log('Found years:', years);

    return res.status(httpStatus.OK).json({
      success: true,
      data: years,
      message: 'Available years fetched successfully'
    });
  }),

  /**
   * Delete location data by year (super admin only)
   * DELETE /api/locations/:id/data/:year
   */
  deleteByYear: asyncHandler(async (req, res) => {
    const { id, year } = req.params;
    console.log('--- DELETE Year Data ---');
    console.log('User ID:', req.user?.id);
    console.log('User Role:', req.user?.role);
    console.log('Target Location ID:', id);
    console.log('Target Year:', year);

    await locationService.deleteByYear(parseInt(id), parseInt(year));
    return ApiResponse.success(res, null, `location data for year ${year} deleted successfully`);
  }),
};

export default locationController;

