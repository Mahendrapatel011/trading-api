import loadingRateService from '../services/loadingRate.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const loadingRateController = {
    create: asyncHandler(async (req, res) => {
        const loadingRate = await loadingRateService.create(req.body);
        return ApiResponse.created(res, loadingRate, 'Loading rate created successfully');
    }),

    update: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const loadingRate = await loadingRateService.update(parseInt(id), req.body);
        return ApiResponse.success(res, loadingRate, 'Loading rate updated successfully');
    }),

    delete: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await loadingRateService.delete(parseInt(id));
        return ApiResponse.success(res, null, 'Loading rate deleted successfully');
    }),

    getAll: asyncHandler(async (req, res) => {
        const { locationId } = req.user;
        const loadingRates = await loadingRateService.getAll(locationId);
        return ApiResponse.success(res, loadingRates);
    }),

    getAllAdmin: asyncHandler(async (req, res) => {
        const loadingRates = await loadingRateService.getAllForSuperAdmin();
        return ApiResponse.success(res, loadingRates);
    }),
};

export default loadingRateController;
