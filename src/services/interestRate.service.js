import InterestRate from '../models/InterestRate.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const interestRateService = {
    getAll: async () => {
        return await InterestRate.findAll({
            where: { isActive: true },
            include: [
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'ASC']],
        });
    },

    getAllForSuperAdmin: async () => {
        return await InterestRate.findAll({
            include: [
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'ASC']],
        });
    },

    create: async (data) => {
        const existing = await InterestRate.findOne({
            where: {
                locationId: data.locationId,
            },
        });

        if (existing) {
            throw new ApiError(httpStatus.CONFLICT, 'Interest rate for this location already exists');
        }

        const interestRate = await InterestRate.create(data);
        return await InterestRate.findByPk(interestRate.id, {
            include: [
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    update: async (id, data) => {
        const interestRate = await InterestRate.findByPk(id);
        if (!interestRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Interest rate not found');
        }

        if (data.locationId && data.locationId !== interestRate.locationId) {
            const existing = await InterestRate.findOne({
                where: {
                    locationId: data.locationId,
                },
            });

            if (existing) {
                throw new ApiError(httpStatus.CONFLICT, 'Interest rate for this location already exists');
            }
        }

        await interestRate.update(data);
        return await InterestRate.findByPk(id, {
            include: [
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    delete: async (id) => {
        const interestRate = await InterestRate.findByPk(id);
        if (!interestRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Interest rate not found');
        }
        await interestRate.destroy();
        return { id, deleted: true };
    },
};

export default interestRateService;
