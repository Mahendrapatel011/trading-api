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
        // Check if supplier with same name exists in same location
        const existing = await Supplier.findOne({
            where: {
                name: data.name,
                locationId: data.locationId,
            },
        });

        if (existing) {
            throw new ApiError(httpStatus.CONFLICT, 'Supplier with this name already exists in this location');
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

        // Check for duplicate name if name is being updated
        if (data.name && data.name !== supplier.name) {
            const existing = await Supplier.findOne({
                where: {
                    id: { [Op.ne]: id },
                    name: data.name,
                    locationId: data.locationId || supplier.locationId,
                },
            });

            if (existing) {
                throw new ApiError(httpStatus.CONFLICT, 'Supplier with this name already exists in this location');
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
