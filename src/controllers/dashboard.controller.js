import dashboardService from '../services/dashboard.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import httpStatus from '../constants/httpStatus.js';

const getStats = asyncHandler(async (req, res) => {
    // Priority: query param > user's locationId (from auth middleware)
    const locationId = req.query.locationId || req.locationId;
    const year = req.query.year;

    const stats = await dashboardService.getStats(locationId, year);
    res.status(httpStatus.OK).send(stats);
});

export default {
    getStats
};
