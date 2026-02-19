import { Op } from 'sequelize';
import LoadingRate from '../models/LoadingRate.js';
import Item from '../models/Item.js';
import Unit from '../models/Unit.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const loadingRateService = {
    getAll: async (locationId = null) => {
        const where = { isActive: true };
        if (locationId) {
            where.locationId = locationId;
        }
        return await LoadingRate.findAll({
            where,
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    getAllForSuperAdmin: async () => {
        return await LoadingRate.findAll({
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    create: async (data) => {
        const existing = await LoadingRate.findOne({
            where: {
                itemId: data.itemId,
                unitId: data.unitId,
                locationId: data.locationId,
            },
        });

        if (existing) {
            throw new ApiError(httpStatus.CONFLICT, 'Loading rate with this combination already exists');
        }

        const loadingRate = await LoadingRate.create(data);
        return await LoadingRate.findByPk(loadingRate.id, {
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    update: async (id, data) => {
        const loadingRate = await LoadingRate.findByPk(id);
        if (!loadingRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Loading rate not found');
        }

        if (data.itemId || data.unitId || data.locationId) {
            const itemId = data.itemId || loadingRate.itemId;
            const unitId = data.unitId || loadingRate.unitId;
            const locationId = data.locationId || loadingRate.locationId;

            const existing = await LoadingRate.findOne({
                where: {
                    id: { [Op.ne]: id },
                    itemId,
                    unitId,
                    locationId,
                },
            });

            if (existing) {
                throw new ApiError(httpStatus.CONFLICT, 'Loading rate with this combination already exists');
            }
        }

        await loadingRate.update(data);
        return await LoadingRate.findByPk(id, {
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    delete: async (id) => {
        const loadingRate = await LoadingRate.findByPk(id);
        if (!loadingRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Loading rate not found');
        }
        await loadingRate.destroy();
        return { id, deleted: true };
    },
};

export default loadingRateService;
