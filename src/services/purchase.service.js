import { Purchase, Supplier, Item, location, Sale, LotTransfer } from '../models/index.js';
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
                    model: location,
                    as: 'location',
                    attributes: ['id', 'name', 'code', 'nameHindi', 'addressHindi', 'officeHindi', 'managerName', 'phone'],
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
                    attributes: ['id', 'name', 'code', 'nameHindi', 'addressHindi', 'officeHindi', 'managerName', 'phone'],
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
                    model: location,
                    as: 'location',
                    attributes: ['id', 'name', 'code', 'nameHindi', 'addressHindi', 'officeHindi', 'managerName', 'phone'],
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
        const purchases = await Purchase.findAll({
            where: { locationId, year },
            attributes: ['billNo'],
            raw: true
        });

        if (purchases.length === 0) {
            return `${year}-1`;
        }

        const nums = purchases
            .map(p => parseInt(p.billNo.split('-')[1] || '0'))
            .filter(n => !isNaN(n) && n > 0);

        if (nums.length === 0) return `${year}-1`;

        const maxNum = Math.max(...nums);

        // If the only numbers are 1000+, jump back to 1 as per user request
        if (maxNum >= 1000 && !nums.some(n => n < 1000)) {
            return `${year}-1`;
        }

        return `${year}-${maxNum + 1}`;
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
        data.amount = data.netWt * parseFloat(data.rate);

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

        if (data.grWt !== undefined || data.cutting !== undefined || data.rate !== undefined) {
            const netWt = data.netWt !== undefined ? data.netWt : (parseFloat(purchase.grWt) - parseFloat(purchase.cutting));
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

    /**
     * Lot Transfer logic (Owner Change)
     */
    lotTransfer: async (purchaseId, data) => {
        const purchase = await Purchase.findByPk(purchaseId);
        if (!purchase) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Purchase lot not found');
        }

        const previousOwnerId = purchase.purchasedForId || purchase.supplierId;
        const previousRate = purchase.rate;

        // Update the Purchase record with the new owner and new rate
        const purchaseUpdate = {
            purchasedForId: data.transferPartyId,
            rate: data.newRate,
            amount: parseFloat(data.netWt) * parseFloat(data.newRate),
            totalCost: (parseFloat(data.netWt) * parseFloat(data.newRate)) + parseFloat(purchase.loadingLabour || 0)
        };
        await purchase.update(purchaseUpdate);

        // Record History
        await LotTransfer.create({
            purchaseId: purchase.id,
            previousOwnerId,
            newOwnerId: data.transferPartyId,
            previousRate,
            newRate: data.newRate,
            transferDate: data.transferDate || new Date().toISOString().split('T')[0],
            noOfPacket: purchase.noOfPacket,
            netWt: purchase.netWt,
            locationId: purchase.locationId,
            year: purchase.year
        });

        return await purchaseService.getById(purchase.id);
    },

    /**
     * Get Transfer History
     */
    getTransferHistory: async (locationId, year, page = 1, limit = 20) => {
        const offset = (page - 1) * limit;
        const where = { locationId, year };

        const { count, rows } = await LotTransfer.findAndCountAll({
            where,
            include: [
                {
                    model: Purchase,
                    as: 'purchase',
                    attributes: ['lotNo', 'agreementNo']
                },
                {
                    model: Supplier,
                    as: 'previousOwner',
                    attributes: ['name']
                },
                {
                    model: Supplier,
                    as: 'newOwner',
                    attributes: ['name']
                }
            ],
            order: [['createdAt', 'DESC']],
            offset,
            limit
        });

        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: rows
        };
    }
};

export default purchaseService;
