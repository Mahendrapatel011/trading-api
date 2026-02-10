import asyncHandler from '../utils/asyncHandler.js';
import saleService from '../services/sale.service.js';
import httpStatus from '../constants/httpStatus.js';

const saleController = {
    getAll: asyncHandler(async (req, res) => {
        const locationId = req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        const result = await saleService.getAll(locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Sales fetched successfully',
            data: result,
        });
    }),

    getPurchasesWithSales: asyncHandler(async (req, res) => {
        const locationId = req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        const result = await saleService.getPurchasesWithSales(locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Purchases with sales fetched successfully',
            data: result,
        });
    }),

    getAvailablePurchases: asyncHandler(async (req, res) => {
        const locationId = req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        const result = await saleService.getAvailablePurchases(locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Available purchases fetched successfully',
            data: result,
        });
    }),

    getById: asyncHandler(async (req, res) => {
        const result = await saleService.getById(req.params.id);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Sale fetched successfully',
            data: result,
        });
    }),

    create: asyncHandler(async (req, res) => {
        const result = await saleService.create(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Sale created successfully',
            data: result,
        });
    }),

    update: asyncHandler(async (req, res) => {
        const result = await saleService.update(req.params.id, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Sale updated successfully',
            data: result,
        });
    }),

    delete: asyncHandler(async (req, res) => {
        await saleService.delete(req.params.id);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Sale deleted successfully',
            data: null,
        });
    }),
};

export default saleController;
