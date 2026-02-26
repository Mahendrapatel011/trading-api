import { Op } from 'sequelize';
import RentRate from '../models/RentRate.js';
import Item from '../models/Item.js';
import Unit from '../models/Unit.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const rentRateService = {
  /**
   * Get all active rent rates
   */
  getAll: async () => {
    const rentRates = await RentRate.findAll({
      where: {
        isActive: true,
      },
      include: [
        { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
        { model: Unit, as: 'unit', attributes: ['id', 'name'] },
        { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    return rentRates;
  },

  /**
   * Get all rent rates for super admin (including inactive)
   */
  getAllForSuperAdmin: async () => {
    const rentRates = await RentRate.findAll({
      include: [
        { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
        { model: Unit, as: 'unit', attributes: ['id', 'name'] },
        { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    return rentRates;
  },

  /**
   * Create rent rate
   */
  create: async (data) => {
    // Check if combination already exists
    const existing = await RentRate.findOne({
      where: {
        itemId: data.itemId,
        unitId: data.unitId,
        locationId: data.locationId,
      },
    });

    if (existing) {
      throw new ApiError(httpStatus.CONFLICT, 'Rent rate with this combination already exists');
    }

    const rentRate = await RentRate.create(data);

    // Reload with associations
    return await RentRate.findByPk(rentRate.id, {
      include: [
        { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
        { model: Unit, as: 'unit', attributes: ['id', 'name'] },
        { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
      ],
    });
  },

  /**
   * Update rent rate
   */
  update: async (id, data) => {
    const rentRate = await RentRate.findOne({
      where: {
        id,
      },
    });

    if (!rentRate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Rent rate not found');
    }

    // Check if new combination conflicts with another rent rate
    if (data.itemId || data.unitId || data.locationId) {
      const itemId = data.itemId || rentRate.itemId;
      const unitId = data.unitId || rentRate.unitId;
      const locationId = data.locationId || rentRate.locationId;

      const existing = await RentRate.findOne({
        where: {
          id: { [Op.ne]: id },
          itemId,
          unitId,
          locationId,
        },
      });

      if (existing) {
        throw new ApiError(httpStatus.CONFLICT, 'Rent rate with this combination already exists');
      }
    }

    await rentRate.update(data);

    // Reload with associations
    return await RentRate.findByPk(rentRate.id, {
      include: [
        { model: Item, as: 'item', attributes: ['id', 'name', 'code'] },
        { model: Unit, as: 'unit', attributes: ['id', 'name'] },
        { model: location, as: 'location', attributes: ['id', 'name', 'code'] },
      ],
    });
  },

  /**
   * Delete rent rate (hard delete)
   */
  delete: async (id) => {
    const rentRate = await RentRate.findOne({
      where: {
        id,
      },
    });

    if (!rentRate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Rent rate not found');
    }

    // Hard delete - permanently remove from database
    await rentRate.destroy();

    return { id, deleted: true };
  },
};

export default rentRateService;

