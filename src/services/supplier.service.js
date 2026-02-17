import { Op } from 'sequelize';
import { Supplier, location } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const supplierService = {
    /**
     * Get all suppliers for a location
     */
    getAll: async (locationId) => {
        const suppliers = await Supplier.findAll({
            where: { locationId, isActive: true },
            order: [['name', 'ASC']],
        });
        return suppliers;
    },

    /**
     * Get all suppliers (Admin)
     */
    getAllAdmin: async () => {
        const suppliers = await Supplier.findAll({
            include: [
                {
                    model: location,
                    as: 'location',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['name', 'ASC']],
        });
        return suppliers;
    },

    /**
     * Get supplier by ID
     */
    getById: async (id, locationId = null) => {
        const where = { id };
        if (locationId) {
            where.locationId = locationId;
        }

        const supplier = await Supplier.findOne({ where });

        if (!supplier) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
        }

        return supplier;
    },

    /**
     * Create supplier
     */
    create: async (data) => {
        // Check if supplier with same name or mobile exists in same location
        const existing = await Supplier.findOne({
            where: {
                [Op.or]: [
                    { name: data.name },
                    { mobileNo: data.mobileNo || 'NONEXIStENT' }
                ],
                locationId: data.locationId,
                isActive: true
            },
        });

        if (existing) {
            const conflictField = existing.name === data.name ? 'name' : 'mobile number';
            throw new ApiError(httpStatus.CONFLICT, `Party with this ${conflictField} already exists in this location`);
        }

        const supplier = await Supplier.create(data);
        return supplier;
    },

    /**
     * Update supplier
     */
    update: async (id, data, locationId = null) => {
        const where = { id };
        if (locationId) {
            where.locationId = locationId;
        }

        const supplier = await Supplier.findOne({ where });

        if (!supplier) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
        }

        // Check for duplicate name or mobile if they are being updated
        if (data.name || data.mobileNo) {
            const existing = await Supplier.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: [
                        { name: data.name || supplier.name },
                        { mobileNo: data.mobileNo || supplier.mobileNo || 'NONEXISTENT' }
                    ],
                    locationId: data.locationId || supplier.locationId,
                    isActive: true
                },
            });

            if (existing) {
                const isNameConflict = existing.name === (data.name || supplier.name);
                const conflictField = isNameConflict ? 'name' : 'mobile number';
                throw new ApiError(httpStatus.CONFLICT, `Party with this ${conflictField} already exists in this location`);
            }
        }

        await supplier.update(data);
        return supplier;
    },

    /**
     * Delete supplier (Soft delete)
     */
    delete: async (id, locationId = null) => {
        const where = { id };
        if (locationId) {
            where.locationId = locationId;
        }

        const supplier = await Supplier.findOne({ where });

        if (!supplier) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
        }

        await supplier.update({ isActive: false });
        return supplier;
    },
};

export default supplierService;
