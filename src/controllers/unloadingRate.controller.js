import unloadingRateService from '../services/unloadingRate.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const unloadingRateController = {
    create: asyncHandler(async (req, res) => {
        const unloadingRate = await unloadingRateService.create(req.body);
        return ApiResponse.created(res, unloadingRate, 'Unloading rate created successfully');
    }),

    update: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const unloadingRate = await unloadingRateService.update(parseInt(id), req.body);
        return ApiResponse.success(res, unloadingRate, 'Unloading rate updated successfully');
    }),

    delete: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await unloadingRateService.delete(parseInt(id));
        return ApiResponse.success(res, null, 'Unloading rate deleted successfully');
    }),

    getAll: asyncHandler(async (req, res) => {
        const unloadingRates = await unloadingRateService.getAll();
        return ApiResponse.success(res, unloadingRates);
    }),

    getAllAdmin: asyncHandler(async (req, res) => {
        const unloadingRates = await unloadingRateService.getAllForSuperAdmin();
        return ApiResponse.success(res, unloadingRates);
    }),
};

export default unloadingRateController;
