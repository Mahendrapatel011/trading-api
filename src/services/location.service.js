import { Op } from 'sequelize';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const locationService = {
  /**
   * Get all locations
   */
  getAll: async () => {
    const locations = await location.findAll({
      order: [['name', 'ASC']],
    });

    return locations;
  },

  /**
   * Get location by ID
   */
  getById: async (id) => {
    const foundLocation = await location.findByPk(id);

    if (!foundLocation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'location not found');
    }

    return foundLocation;
  },

  /**
   * Create location
   */
  create: async (data) => {
    // Auto-generate numerical code if not provided
    if (!data.code) {
      const alllocations = await location.findAll({
        order: [['code', 'ASC']],
      });

      // Extract numeric codes
      const numericCodes = alllocations
        .map(w => {
          const num = parseInt(w.code);
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

    // Check if name or code already exists
    const existing = await location.findOne({
      where: {
        [Op.or]: [
          { name: data.name },
          { code: data.code },
        ],
      },
    });

    if (existing) {
      throw new ApiError(httpStatus.CONFLICT, 'location with this name or code already exists');
    }

    const createdLocation = await location.create(data);

    return createdLocation;
  },

  /**
   * Update location
   */
  update: async (id, data) => {
    const foundLocation = await location.findByPk(id);

    if (!foundLocation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'location not found');
    }

    // Check if name or code conflicts
    if (data.name || data.code) {
      const existing = await location.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            { name: data.name || foundLocation.name },
            { code: data.code || foundLocation.code },
          ],
        },
      });

      if (existing) {
        throw new ApiError(httpStatus.CONFLICT, 'location with this name or code already exists');
      }
    }

    await foundLocation.update(data);

    return foundLocation;
  },

  /**
   * Delete location
   */
  delete: async (id) => {
    const foundLocation = await location.findByPk(id);

    if (!foundLocation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'location not found');
    }

    await foundLocation.destroy();

    return foundLocation;
  },
};

export default locationService;
