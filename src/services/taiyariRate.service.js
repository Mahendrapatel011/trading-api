import { Op } from 'sequelize';
import TaiyariRate from '../models/TaiyariRate.js';
import Item from '../models/Item.js';
import Unit from '../models/Unit.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const taiyariRateService = {
    getAll: async () => {
        return await TaiyariRate.findAll({
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
        return await TaiyariRate.findAll({
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    create: async (data) => {
        const existing = await TaiyariRate.findOne({
            where: {
                itemId: data.itemId,
                unitId: data.unitId,
                locationId: data.locationId,
            },
        });

        if (existing) {
            throw new ApiError(httpStatus.CONFLICT, 'Taiyari rate with this combination already exists');
        }

        const taiyariRate = await TaiyariRate.create(data);
        return await TaiyariRate.findByPk(taiyariRate.id, {
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    update: async (id, data) => {
        const taiyariRate = await TaiyariRate.findByPk(id);
        if (!taiyariRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Taiyari rate not found');
        }

        if (data.itemId || data.unitId || data.locationId) {
            const itemId = data.itemId || taiyariRate.itemId;
            const unitId = data.unitId || taiyariRate.unitId;
            const locationId = data.locationId || taiyariRate.locationId;

            const existing = await TaiyariRate.findOne({
                where: {
                    id: { [Op.ne]: id },
                    itemId,
                    unitId,
                    locationId,
                },
            });

            if (existing) {
                throw new ApiError(httpStatus.CONFLICT, 'Taiyari rate with this combination already exists');
            }
        }

        await taiyariRate.update(data);
        return await TaiyariRate.findByPk(id, {
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
                { model: Unit, as: 'unit', attributes: ['id', 'name'] },
                { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
            ],
        });
    },

    delete: async (id) => {
        const taiyariRate = await TaiyariRate.findByPk(id);
        if (!taiyariRate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Taiyari rate not found');
        }
        await taiyariRate.destroy();
        return { id, deleted: true };
    },
};

export default taiyariRateService;
