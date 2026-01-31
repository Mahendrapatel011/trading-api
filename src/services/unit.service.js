import { Op } from 'sequelize';
import Unit from '../models/Unit.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const unitService = {
  /**
   * Get all units (both Bag and Quintal are always active)
   */
  getAll: async () => {
    const units = await Unit.findAll({
      order: [['name', 'ASC']],
    });

    return units;
  },

  /**
   * Get all units for super admin (including inactive)
   */
  getAllForSuperAdmin: async () => {
    const units = await Unit.findAll({
      order: [['name', 'ASC']],
    });

    return units;
  },

  /**
   * Create unit
   */
  create: async (data) => {
    const existingName = await Unit.findOne({
      where: {
        name: data.name,
      },
    });

    if (existingName) {
      throw new ApiError(httpStatus.CONFLICT, `Unit with name "${data.name}" already exists`);
    }

    const unit = await Unit.create({
      ...data,
      isActive: true,
    });

    return unit;
  },

  /**
   * Update unit
   */
  update: async (id, data) => {
    const unit = await Unit.findOne({
      where: {
        id,
      },
    });

    if (!unit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Unit not found');
    }

    if (data.name && data.name !== unit.name) {
      const existingName = await Unit.findOne({
        where: {
          id: { [Op.ne]: id },
          name: data.name,
        },
      });

      if (existingName) {
        throw new ApiError(httpStatus.CONFLICT, `Unit with name "${data.name}" already exists`);
      }
    }

    const updateData = { ...data };
    delete updateData.isActive;

    await unit.update(updateData);

    return unit;
  },

  /**
   * Delete unit (soft delete)
   */
  delete: async (id) => {
    const unit = await Unit.findOne({
      where: {
        id,
      },
    });

    if (!unit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Unit not found');
    }

    await unit.update({ isActive: false });

    return unit;
  },
};

export default unitService;

