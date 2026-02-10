import { Purchase, Supplier, Item, location, Sale } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const purchaseService = {
    /**
     * Get all purchases for a location and year
     */
    getAll: async (locationId, year) => {
        const where = { locationId, isActive: true };
        if (year) {
            where.year = year;
        }

        const purchases = await Purchase.findAll({
            where,
            include: [
                {
                    model: Supplier,
                    as: 'supplier',
                    attributes: ['id', 'name', 'mobileNo'],
                },
                {
                    model: Supplier,
                    as: 'purchasedFor',
                    attributes: ['id', 'name', 'mobileNo'],
                },
                {
                    model: Item,
                    as: 'item',
                    attributes: ['id', 'name', 'code'],
                },
                {
                    model: Sale,
                    as: 'sales',
                    where: { isActive: true },
                    required: false,
                }
            ],
            order: [['billDate', 'DESC'], ['billNo', 'DESC']],
        });
        return purchases;
    },

    /**
     * Get all purchases (Admin - all locations)
     */
    getAllAdmin: async (year) => {
        const where = { isActive: true };
        if (year) {
            where.year = year;
        }

        const purchases = await Purchase.findAll({
            where,
            include: [
                {
                    model: location,
                    as: 'location',
                    attributes: ['id', 'name'],
                },
                {
                    model: Supplier,
                    as: 'supplier',
                    attributes: ['id', 'name', 'mobileNo'],
                },
                {
                    model: Supplier,
                    as: 'purchasedFor',
                    attributes: ['id', 'name', 'mobileNo'],
                },
                {
                    model: Item,
                    as: 'item',
                    attributes: ['id', 'name', 'code'],
                },
                {
                    model: Sale,
                    as: 'sales',
                    where: { isActive: true },
                    required: false,
                }
            ],
            order: [['billDate', 'DESC'], ['billNo', 'DESC']],
        });
        return purchases;
    },

    /**
     * Get purchase by ID
     */
    getById: async (id, locationId = null, year = null) => {
        const where = { id };
        if (locationId) {
            where.locationId = locationId;
        }
        if (year) {
            where.year = year;
        }

        const purchase = await Purchase.findOne({
            where,
            include: [
                {
                    model: Supplier,
                    as: 'supplier',
                    attributes: ['id', 'name', 'mobileNo'],
                },
                {
                    model: Supplier,
                    as: 'purchasedFor',
                    attributes: ['id', 'name', 'mobileNo'],
                },
                {
                    model: Item,
                    as: 'item',
                    attributes: ['id', 'name', 'code'],
                },
            ],
        });

        if (!purchase) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
        }

        return purchase;
    },

    /**
     * Generate next Bill Number for location and year
     */
    generateBillNo: async (locationId, year) => {
        const lastPurchase = await Purchase.findOne({
            where: { locationId, year },
            order: [['billNo', 'DESC']],
            attributes: ['billNo'],
        });

        if (!lastPurchase) {
            return `${year}-1001`;
        }

        const lastBillNo = lastPurchase.billNo;
        const parts = lastBillNo.split('-');
        const nextNumber = parseInt(parts[1] || '1001') + 1;
        return `${year}-${nextNumber}`;
    },

    /**
     * Check if agreement number is duplicate
     */
    checkDuplicateAgreement: async (locationId, year, agreementNo, excludeId = null) => {
        const where = {
            locationId,
            year,
            agreementNo,
        };

        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }

        const existing = await Purchase.findOne({ where });
        return !!existing;
    },

    /**
     * Create purchase
     */
    create: async (data) => {
        // Check duplicate agreement number
        const isDuplicate = await purchaseService.checkDuplicateAgreement(
            data.locationId,
            data.year,
            data.agreementNo
        );

        if (isDuplicate) {
            throw new ApiError(
                httpStatus.CONFLICT,
                `Agreement No. ${data.agreementNo} already exists for this location and year`
            );
        }

        // Auto-generate Bill No if not provided
        if (!data.billNo) {
            data.billNo = await purchaseService.generateBillNo(data.locationId, data.year);
        }

        // Calculate Lot No: agreementNo / noOfPacket
        data.lotNo = `${data.agreementNo}/${data.noOfPacket}`;

        // Calculate Net Weight
        data.netWt = parseFloat(data.grWt) - parseFloat(data.cutting || 0);

        // Calculate Amount
        data.amount = parseFloat(data.netWt) * parseFloat(data.rate);

        // Calculate Total Cost
        data.totalCost = parseFloat(data.amount) + parseFloat(data.loadingLabour || 0);

        const purchase = await Purchase.create(data);

        // Fetch with relations
        return await purchaseService.getById(purchase.id);
    },

    /**
     * Update purchase
     */
    update: async (id, data, locationId = null, year = null) => {
        const where = { id };
        if (locationId) {
            where.locationId = locationId;
        }
        if (year) {
            where.year = year;
        }

        const purchase = await Purchase.findOne({ where });

        if (!purchase) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
        }

        // Check for duplicate agreement if agreementNo is being updated
        if (data.agreementNo && data.agreementNo !== purchase.agreementNo) {
            const isDuplicate = await purchaseService.checkDuplicateAgreement(
                purchase.locationId,
                purchase.year,
                data.agreementNo,
                id
            );

            if (isDuplicate) {
                throw new ApiError(
                    httpStatus.CONFLICT,
                    `Agreement No. ${data.agreementNo} already exists for this location and year`
                );
            }
        }

        // Recalculate if relevant fields change
        if (data.agreementNo || data.noOfPacket) {
            data.lotNo = `${data.agreementNo || purchase.agreementNo}/${data.noOfPacket || purchase.noOfPacket}`;
        }

        if (data.grWt !== undefined || data.cutting !== undefined) {
            const grWt = parseFloat(data.grWt !== undefined ? data.grWt : purchase.grWt);
            const cutting = parseFloat(data.cutting !== undefined ? data.cutting : purchase.cutting);
            data.netWt = grWt - cutting;
        }

        if (data.netWt !== undefined || data.rate !== undefined) {
            const netWt = parseFloat(data.netWt !== undefined ? data.netWt : purchase.netWt);
            const rate = parseFloat(data.rate !== undefined ? data.rate : purchase.rate);
            data.amount = netWt * rate;
        }

        if (data.amount !== undefined || data.loadingLabour !== undefined) {
            const amount = parseFloat(data.amount !== undefined ? data.amount : purchase.amount);
            const loadingLabour = parseFloat(data.loadingLabour !== undefined ? data.loadingLabour : purchase.loadingLabour);
            data.totalCost = amount + loadingLabour;
        }

        await purchase.update(data);
        return await purchaseService.getById(id);
    },

    /**
     * Delete purchase (Soft delete)
     */
    delete: async (id, locationId = null, year = null) => {
        const where = { id };
        if (locationId) {
            where.locationId = locationId;
        }
        if (year) {
            where.year = year;
        }

        const purchase = await Purchase.findOne({ where });

        if (!purchase) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
        }

        await purchase.update({ isActive: false });
        return purchase;
    },
};

export default purchaseService;
