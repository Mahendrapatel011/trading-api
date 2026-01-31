import supplierService from '../services/supplier.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import httpStatus from '../constants/httpStatus.js';
import ApiError from '../utils/ApiError.js';

const supplierController = {
    getAll: asyncHandler(async (req, res) => {
        const locationId = req.locationId; // From auth middleware
        const suppliers = await supplierService.getAll(locationId);
        res.status(httpStatus.OK).json({
            success: true,
            data: suppliers,
        });
    }),

    getAllAdmin: asyncHandler(async (req, res) => {
        const suppliers = await supplierService.getAllAdmin();
        res.status(httpStatus.OK).json({
            success: true,
            data: suppliers,
        });
    }),

    getById: asyncHandler(async (req, res) => {
        const locationId = req.isSuperAdmin ? null : req.locationId;
        const supplier = await supplierService.getById(req.params.id, locationId);
        res.status(httpStatus.OK).json({
            success: true,
            data: supplier,
        });
    }),

    create: asyncHandler(async (req, res) => {
        // If not super admin, force locationId from token
        if (!req.isSuperAdmin) {
            req.body.locationId = req.locationId;
        }

        // Ensure locationId is present (needed since we relaxed validation to allow it to be set here)
        if (!req.body.locationId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Location is required');
        }

        const supplier = await supplierService.create(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            data: supplier,
        });
    }),

    update: asyncHandler(async (req, res) => {
        const locationId = req.isSuperAdmin ? null : req.locationId;
        const supplier = await supplierService.update(req.params.id, req.body, locationId);
        res.status(httpStatus.OK).json({
            success: true,
            data: supplier,
        });
    }),

    delete: asyncHandler(async (req, res) => {
        const locationId = req.isSuperAdmin ? null : req.locationId;
        await supplierService.delete(req.params.id, locationId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Supplier deleted successfully',
        });
    }),
};

export default supplierController;
