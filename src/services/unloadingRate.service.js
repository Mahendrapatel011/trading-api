import { Op } from 'sequelize';
import UnloadingRate from '../models/UnloadingRate.js';
import Item from '../models/Item.js';
import Unit from '../models/Unit.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const unloadingRateService = {
    getAll: async () => {
        return await UnloadingRate.findAll({
            where: { isActive: true },
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    getAllForSuperAdmin: async () => {
        return await UnloadingRate.findAll({
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    create: async (data) => {
        const existing = await UnloadingRate.findOne({
            where: {
                itemId: data.itemId,
                unitId: data.unitId,
                locationId: data.locationId,
            },
        });

        if (existing) {
            throw new ApiError(httpStatus.CONFLICT, 'Unloading rate with this combination already exists');
        }

        const unloadingRate = await UnloadingRate.create(data);
        return await UnloadingRate.findByPk(unloadingRate.id, {
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    update: async (id, data) => {
        const unloadingRate = await UnloadingRate.findByPk(id);
        if (!unloadingRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Unloading rate not found');
        }

        if (data.itemId || data.unitId || data.locationId) {
            const itemId = data.itemId || unloadingRate.itemId;
            const unitId = data.unitId || unloadingRate.unitId;
            const locationId = data.locationId || unloadingRate.locationId;

            const existing = await UnloadingRate.findOne({
                where: {
                    id: { [Op.ne]: id },
                    itemId,
                    unitId,
                    locationId,
                },
            });

            if (existing) {
                throw new ApiError(httpStatus.CONFLICT, 'Unloading rate with this combination already exists');
            }
        }

        await unloadingRate.update(data);
        return await UnloadingRate.findByPk(id, {
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    delete: async (id) => {
        const unloadingRate = await UnloadingRate.findByPk(id);
        if (!unloadingRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Unloading rate not found');
        }
        await unloadingRate.destroy();
        return { id, deleted: true };
    },
};

export default unloadingRateService;
