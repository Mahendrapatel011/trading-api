import interestRateService from '../services/interestRate.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const interestRateController = {
    create: asyncHandler(async (req, res) => {
        const interestRate = await interestRateService.create(req.body);
        return ApiResponse.created(res, interestRate, 'Interest rate created successfully');
    }),

    update: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const interestRate = await interestRateService.update(parseInt(id), req.body);
        return ApiResponse.success(res, interestRate, 'Interest rate updated successfully');
    }),

    delete: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await interestRateService.delete(parseInt(id));
        return ApiResponse.success(res, null, 'Interest rate deleted successfully');
    }),

    getAll: asyncHandler(async (req, res) => {
        const interestRates = await interestRateService.getAll();
        return ApiResponse.success(res, interestRates);
    }),

    getAllAdmin: asyncHandler(async (req, res) => {
        const interestRates = await interestRateService.getAllForSuperAdmin();
        return ApiResponse.success(res, interestRates);
    }),
};

export default interestRateController;
