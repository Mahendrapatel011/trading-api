import { Op } from 'sequelize';
import Item from '../models/Item.js';
import RentRate from '../models/RentRate.js';
import LoadingRate from '../models/LoadingRate.js';
import UnloadingRate from '../models/UnloadingRate.js';
import TaiyariRate from '../models/TaiyariRate.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const itemService = {
  /**
   * Get all active items (global - available for all locations)
   */
  getAll: async () => {
    const items = await Item.findAll({
      where: {
        isActive: true,
      },
      order: [['name', 'ASC']],
    });

    return items;
  },

  /**
   * Get all items for super admin (including inactive)
   */
  getAllForSuperAdmin: async () => {
    const items = await Item.findAll({
      order: [['name', 'ASC']],
    });

    return items;
  },

  /**
   * Create item (global - available for all locations)
   */
  create: async (data) => {
    // Check if name already exists
    const existingName = await Item.findOne({
      where: {
        name: data.name,
      },
    });

    if (existingName) {
      throw new ApiError(httpStatus.CONFLICT, `Item with name "${data.name}" already exists`);
    }

    // Auto-generate numerical code if not provided
    if (!data.code) {
      const allItems = await Item.findAll({
        order: [['code', 'ASC']],
      });

      // Extract numeric codes
      const numericCodes = allItems
        .map(item => {
          const num = parseInt(item.code);
          return isNaN(num) ? 0 : num;
        })
        .filter(num => num > 0);

      // Find next available number
      let nextCode = 1;
      if (numericCodes.length > 0) {
        const maxCode = Math.max(...numericCodes);
        nextCode = maxCode + 1;
      }

      data.code = nextCode.toString();
    }

    // Check if code already exists
    const existingCode = await Item.findOne({
      where: {
        code: data.code,
      },
    });

    if (existingCode) {
      throw new ApiError(httpStatus.CONFLICT, `Item with code "${data.code}" already exists`);
    }

    const item = await Item.create(data);

    return item;
  },

  /**
   * Update item
   */
  update: async (id, data) => {
    const item = await Item.findOne({
      where: {
        id,
      },
    });

    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }

    // Check if name conflicts with another item
    if (data.name && data.name !== item.name) {
      const existingName = await Item.findOne({
        where: {
          id: { [Op.ne]: id },
          name: data.name,
        },
      });

      if (existingName) {
        throw new ApiError(httpStatus.CONFLICT, `Item with name "${data.name}" already exists`);
      }
    }

    // Check if code conflicts with another item
    if (data.code && data.code !== item.code) {
      const existingCode = await Item.findOne({
        where: {
          id: { [Op.ne]: id },
          code: data.code,
        },
      });

      if (existingCode) {
        throw new ApiError(httpStatus.CONFLICT, `Item with code "${data.code}" already exists`);
      }
    }

    await item.update(data);

    return item;
  },

  /**
   * Delete item (hard delete)
   * Also deletes all related rates (rent rates, loading rates, unloading rates, taiyari rates)
   */
  delete: async (id) => {
    const item = await Item.findOne({
      where: {
        id,
      },
    });

    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }

    // Delete all related rates first (to avoid foreign key constraint errors)
    await Promise.all([
      RentRate.destroy({ where: { itemId: id } }),
      LoadingRate.destroy({ where: { itemId: id } }),
      UnloadingRate.destroy({ where: { itemId: id } }),
      TaiyariRate.destroy({ where: { itemId: id } })
    ]);

    // Hard delete - permanently remove from database
    await item.destroy();

    return { id, deleted: true };
  },
};

export default itemService;
