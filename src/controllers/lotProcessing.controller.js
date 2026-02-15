import httpStatus from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import lotProcessingService from '../services/lotProcessing.service.js';

const createLotProcessing = asyncHandler(async (req, res) => {
    const lotProcessing = await lotProcessingService.createLotProcessing(req.body);
    res.status(httpStatus.CREATED).send(lotProcessing);
});

const getLotProcessings = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.purchaseId) {
        filter.purchaseId = req.query.purchaseId;
    }
    const result = await lotProcessingService.queryLotProcessings(filter);
    res.send(result);
});

const getLotProcessing = asyncHandler(async (req, res) => {
    const lotProcessing = await lotProcessingService.getLotProcessingById(req.params.id);
    res.send(lotProcessing);
});

const getLotProcessingsByPurchase = asyncHandler(async (req, res) => {
    const result = await lotProcessingService.getLotProcessingsByPurchaseId(req.params.purchaseId);
    res.send(result);
});

const updateLotProcessing = asyncHandler(async (req, res) => {
    const lotProcessing = await lotProcessingService.updateLotProcessingById(req.params.id, req.body);
    res.send(lotProcessing);
});

const deleteLotProcessing = asyncHandler(async (req, res) => {
    await lotProcessingService.deleteLotProcessingById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createLotProcessing,
    getLotProcessings,
    getLotProcessing,
    getLotProcessingsByPurchase,
    updateLotProcessing,
    deleteLotProcessing,
};
