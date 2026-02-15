import httpStatus from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import loanService from '../services/loan.service.js';

const loanController = {
    create: asyncHandler(async (req, res) => {
        const result = await loanService.create(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Loan entry created successfully',
            data: result,
        });
    }),

    update: asyncHandler(async (req, res) => {
        const result = await loanService.update(req.params.id, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Loan entry updated successfully',
            data: result,
        });
    }),

    delete: asyncHandler(async (req, res) => {
        const result = await loanService.delete(req.params.id);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Loan entry deleted successfully',
            data: result,
        });
    }),

    getByPurchase: asyncHandler(async (req, res) => {
        const result = await loanService.getByPurchase(req.params.purchaseId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Loans fetched successfully',
            data: result,
        });
    }),

    getAll: asyncHandler(async (req, res) => {
        const { year } = req.query;
        const result = await loanService.getAll(year);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'All loans fetched successfully',
            data: result,
        });
    })
};

export default loanController;
