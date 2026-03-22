import purchaseService from '../services/purchase.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import httpStatus from '../constants/httpStatus.js';
import ApiError from '../utils/ApiError.js';

const purchaseController = {
    /**
     * Get all purchases for logged-in user's location
     */
    getAll: asyncHandler(async (req, res) => {
        const locationId = req.locationId; // From auth middleware
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const purchases = await purchaseService.getAll(locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            data: purchases,
        });
    }),

    /**
     * Get all purchases (Super Admin - all locations)
     */
    getAllAdmin: asyncHandler(async (req, res) => {
        const year = req.query.year ? parseInt(req.query.year) : null;
        const purchases = await purchaseService.getAllAdmin(year);
        res.status(httpStatus.OK).json({
            success: true,
            data: purchases,
        });
    }),

    /**
     * Get purchase by ID
     */
    getById: asyncHandler(async (req, res) => {
        const locationId = req.isSuperAdmin ? null : req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : null;
        const purchase = await purchaseService.getById(req.params.id, locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            data: purchase,
        });
    }),

    /**
     * Generate next Bill Number
     */
    generateBillNo: asyncHandler(async (req, res) => {
        // If impersonating, req.locationId is already set to the impersonated location.
        // Prefer explicit body.locationId (for non-impersonating super admin), then fallback to req.locationId.
        const locationId = req.isSuperAdmin
            ? (req.body.locationId || req.locationId)
            : req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        if (!locationId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Location is required');
        }

        const billNo = await purchaseService.generateBillNo(locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            data: { billNo },
        });
    }),

    /**
     * Create new purchase
     */
    create: asyncHandler(async (req, res) => {
        // If not super admin, force locationId from token
        if (!req.isSuperAdmin) {
            req.body.locationId = req.locationId;
        }

        // If super admin is impersonating and no explicit locationId given, use the impersonated location
        if (req.isSuperAdmin && !req.body.locationId && req.locationId) {
            req.body.locationId = req.locationId;
        }

        // Ensure locationId is present
        if (!req.body.locationId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Location is required');
        }

        // Set year from request or default to current year
        if (!req.body.year) {
            req.body.year = new Date().getFullYear();
        }

        const purchase = await purchaseService.create(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Purchase created successfully',
            data: purchase,
        });
    }),

    /**
     * Update purchase
     */
    update: asyncHandler(async (req, res) => {
        const locationId = req.isSuperAdmin ? null : req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : null;
        const purchase = await purchaseService.update(req.params.id, req.body, locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Purchase updated successfully',
            data: purchase,
        });
    }),

    /**
     * Delete purchase
     */
    delete: asyncHandler(async (req, res) => {
        const locationId = req.isSuperAdmin ? null : req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : null;
        await purchaseService.delete(req.params.id, locationId, year);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Purchase deleted successfully',
        });
    }),

    /**
     * Lot Transfer
     */
    lotTransfer: asyncHandler(async (req, res) => {
        const result = await purchaseService.lotTransfer(req.body.purchaseId, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Lot transferred successfully',
            data: result,
        });
    }),

    /**
     * Get Transfer History
     */
    getTransferHistory: asyncHandler(async (req, res) => {
        const locationId = req.locationId;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;

        const history = await purchaseService.getTransferHistory(locationId, year, page, limit);
        res.status(httpStatus.OK).json({
            success: true,
            data: history,
        });
    }),

    /**
     * Restore a soft-deleted purchase by agreement number (Super Admin / Impersonating only)
     */
    restore: asyncHandler(async (req, res) => {
        // Must be super admin (impersonating or not)
        if (!req.isSuperAdmin) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Only super admin can restore deleted purchases');
        }

        const locationId = req.body.locationId || req.locationId;
        const { year, agreementNo } = req.body;

        if (!locationId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Location is required');
        }
        if (!year) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Year is required');
        }
        if (!agreementNo || !agreementNo.trim()) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Agreement No. is required');
        }

        const purchase = await purchaseService.restoreByAgreementNo(
            locationId,
            parseInt(year),
            agreementNo.trim()
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: `Purchase with Agreement No. "${agreementNo}" restored successfully`,
            data: purchase,
        });
    }),
};

export default purchaseController;
