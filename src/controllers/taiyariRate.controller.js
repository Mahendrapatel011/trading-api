import taiyariRateService from '../services/taiyariRate.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const taiyariRateController = {
    create: asyncHandler(async (req, res) => {
        const taiyariRate = await taiyariRateService.create(req.body);
        return ApiResponse.created(res, taiyariRate, 'Taiyari rate created successfully');
    }),

    update: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const taiyariRate = await taiyariRateService.update(parseInt(id), req.body);
        return ApiResponse.success(res, taiyariRate, 'Taiyari rate updated successfully');
    }),

    delete: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await taiyariRateService.delete(parseInt(id));
        return ApiResponse.success(res, null, 'Taiyari rate deleted successfully');
    }),

    getAll: asyncHandler(async (req, res) => {
        const taiyariRates = await taiyariRateService.getAll();
        return ApiResponse.success(res, taiyariRates);
    }),

    getAllAdmin: asyncHandler(async (req, res) => {
        const taiyariRates = await taiyariRateService.getAllForSuperAdmin();
        return ApiResponse.success(res, taiyariRates);
    }),
};

export default taiyariRateController;
