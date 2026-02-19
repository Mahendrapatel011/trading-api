import { Op } from 'sequelize';
import { sequelize } from '../config/database.config.js';
import { Purchase, Sale, Loan, LotProcessing, LoanRepayment, location as LocationModel } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const locationService = {
  /**
   * Get all locations
   */
  getAll: async () => {
    const locations = await LocationModel.findAll({
      order: [['name', 'ASC']],
    });

    return locations;
  },

  /**
   * Get location by ID
   */
  getById: async (id) => {
    const foundLocation = await LocationModel.findByPk(id);

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
      const alllocations = await LocationModel.findAll({
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
    const existing = await LocationModel.findOne({
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

    const createdLocation = await LocationModel.create(data);

    return createdLocation;
  },

  /**
   * Update location
   */
  update: async (id, data) => {
    const foundLocation = await LocationModel.findByPk(id);

    if (!foundLocation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'location not found');
    }

    // Check if name or code conflicts
    if (data.name || data.code) {
      const existing = await LocationModel.findOne({
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
    const foundLocation = await LocationModel.findByPk(id);

    if (!foundLocation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'location not found');
    }

    await foundLocation.destroy();
    return foundLocation;
  },

  /**
   * Get available years for a location
   */
  getAvailableYears: async (locationId) => {
    if (!locationId) return [];

    // Find unique years from purchases for this location
    const results = await Purchase.findAll({
      where: { locationId },
      attributes: ['year'],
      group: ['year'],
      raw: true,
    });

    return results
      .map(r => parseInt(r.year))
      .filter(y => !isNaN(y))
      .sort((a, b) => b - a);
  },

  /**
   * Delete all location data for a specific year permanently
   */
  deleteByYear: async (locationId, year) => {
    const t = await sequelize.transaction();

    try {
      // 1. Find all purchases for this location and year
      const purchases = await Purchase.findAll({
        where: { locationId, year },
        attributes: ['id'],
        transaction: t
      });

      const purchaseIds = purchases.map(p => p.id);

      if (purchaseIds.length > 0) {
        // 2. Delete LoanRepayments
        const loans = await Loan.findAll({
          where: { purchaseId: { [Op.in]: purchaseIds } },
          attributes: ['id'],
          transaction: t
        });
        const loanIds = loans.map(l => l.id);

        if (loanIds.length > 0) {
          await LoanRepayment.destroy({
            where: { loanId: { [Op.in]: loanIds } },
            transaction: t
          });
        }

        // 3. Delete Loans
        await Loan.destroy({
          where: { purchaseId: { [Op.in]: purchaseIds } },
          transaction: t
        });

        // 4. Delete Sales
        await Sale.destroy({
          where: { purchaseId: { [Op.in]: purchaseIds } },
          transaction: t
        });

        // 5. Delete LotProcessings
        await LotProcessing.destroy({
          where: { purchaseId: { [Op.in]: purchaseIds } },
          transaction: t
        });

        // 6. Delete Purchases
        await Purchase.destroy({
          where: { id: { [Op.in]: purchaseIds } },
          transaction: t
        });
      }

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};

export default locationService;
