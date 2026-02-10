import { Sale, Purchase, Item, Supplier, UnloadingRate, TaiyariRate, RentRate, Loan } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';
import { sequelize } from '../config/database.config.js';

const saleService = {
    /**
     * Get all sales for a location and year (via Purchase)
     */
    getAll: async (locationId, year) => {
        const sales = await Sale.findAll({
            include: [
                {
                    model: Purchase,
                    as: 'purchase',
                    where: { locationId, year, isActive: true },
                    include: [
                        { model: Item, as: 'item', attributes: ['name'] },
                        { model: Supplier, as: 'supplier', attributes: ['name'] }
                    ]
                }
            ],
            where: { isActive: true },
            order: [['saleDt', 'DESC']]
        });
        return sales;
    },

    /**
     * Get all purchases with their sales for a location and year
     * This helps the UI to show sales grouped by purchase lot
     */
    getPurchasesWithSales: async (locationId, year) => {
        const purchases = await Purchase.findAll({
            where: { locationId, year, isActive: true },
            include: [
                { model: Item, as: 'item', attributes: ['name'] },
                { model: Supplier, as: 'supplier', attributes: ['name'] },
                { model: Supplier, as: 'purchasedFor', attributes: ['name'] },
                {
                    model: Sale,
                    as: 'sales',
                    where: { isActive: true },
                    required: false,
                    order: [['saleDt', 'ASC']]
                },
                {
                    model: Loan,
                    as: 'loans',
                    where: { isActive: true },
                    required: false,
                    order: [['loanDt', 'ASC']]
                }
            ],
            order: [['billDate', 'DESC']]
        });

        return purchases.map(p => {
            const soldWt = p.sales.reduce((sum, s) => sum + parseFloat(s.saleWt || 0), 0);
            const soldPkt = p.sales.reduce((sum, s) => sum + parseInt(s.salePkt || 0), 0);

            const remainingWt = (parseFloat(p.netWt) - soldWt).toFixed(3);
            const remainingPkt = p.noOfPacket - soldPkt;

            // Calculate shortage: (Gross Wt - Total Sold Wt) / Gross Wt * 100
            let shortage = 0;
            if (p.sales.length > 0) {
                const grWt = parseFloat(p.grWt) || 0;
                if (grWt > 0) {
                    shortage = (((grWt - soldWt) / grWt) * 100).toFixed(2);
                }
            }

            return {
                ...p.toJSON(),
                remainingWt,
                remainingPkt,
                shortage
            };
        });
    },

    /**
     * Get available purchases for a location and year with remaining weight
     */
    getAvailablePurchases: async (locationId, year) => {
        const purchases = await Purchase.findAll({
            where: { locationId, year, isActive: true },
            include: [
                { model: Item, as: 'item', attributes: ['id', 'name'] },
                { model: Supplier, as: 'supplier', attributes: ['id', 'name'] },
                { model: Sale, as: 'sales', where: { isActive: true }, required: false }
            ]
        });

        // Current Rates from Super Admin
        const unloadingRates = await UnloadingRate.findAll({ where: { locationId, isActive: true } });
        const taiyariRates = await TaiyariRate.findAll({ where: { locationId, isActive: true } });
        const rentRates = await RentRate.findAll({ where: { locationId, isActive: true } });

        // Filter those which have remaining weight or packets
        return purchases
            .map(p => {
                const soldWt = p.sales.reduce((sum, s) => sum + parseFloat(s.saleWt || 0), 0);
                const soldPkt = p.sales.reduce((sum, s) => sum + parseInt(s.salePkt || 0), 0);

                // Fetch common fields from the first sale of this lot (if any)
                const firstSale = p.sales.length > 0 ? p.sales[0] : null;

                // Find rates for this specific item
                const uRate = unloadingRates.find(r => r.itemId === p.itemId)?.rate || 0;
                const tRate = taiyariRates.find(r => r.itemId === p.itemId)?.rate || 0;
                const rRate = rentRates.find(r => r.itemId === p.itemId)?.rate || 0;

                return {
                    id: p.id,
                    agreementNo: p.agreementNo,
                    lotNo: p.lotNo,
                    item: p.item.name,
                    itemId: p.itemId,
                    supplier: p.supplier.name,
                    totalPkt: p.noOfPacket,
                    totalWt: p.netWt,
                    soldPkt,
                    soldWt,
                    remainingPkt: p.noOfPacket - soldPkt,
                    remainingWt: (parseFloat(p.netWt) - soldWt).toFixed(3),
                    // Pre-fill fields for subsequent sales
                    existingNikashiPkt: firstSale ? firstSale.nikashiPkt : 0,
                    existingTayariPkt: firstSale ? firstSale.tayariPkt : 0,
                    existingCharri: firstSale ? firstSale.charri : 0,
                    existingNewBags: firstSale ? firstSale.newBags : 0,
                    existingSutli: firstSale ? firstSale.sutli : 0,
                    existingPktCollection: firstSale ? firstSale.pktCollection : 0,
                    existingRaffuChipri: firstSale ? firstSale.raffuChipri : 0,
                    // Super Admin Rates
                    itemUnloadingRate: uRate,
                    itemTaiyariRate: tRate,
                    itemRentRate: rRate
                };
            })
            .filter(p => p.remainingPkt > 0);
    },

    /**
     * Get sale by ID
     */
    getById: async (id) => {
        const sale = await Sale.findOne({
            where: { id, isActive: true },
            include: [
                {
                    model: Purchase,
                    as: 'purchase',
                    include: [
                        { model: Item, as: 'item', attributes: ['name'] },
                        { model: Supplier, as: 'supplier', attributes: ['name'] }
                    ]
                }
            ]
        });

        if (!sale) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Sale record not found');
        }

        return sale;
    },

    /**
     * Create sale
     */
    create: async (data) => {
        const purchase = await Purchase.findByPk(data.purchaseId, {
            include: [{ model: Item, as: 'item' }]
        });
        if (!purchase) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Purchase record not found');
        }

        // Auto-fetch rates from Super Admin if not provided
        const locationId = purchase.locationId;
        const itemId = purchase.itemId;

        const saleWt = parseFloat(data.saleWt || 0);
        const salePkt = parseInt(data.salePkt || 0);
        const nikashiPkt = parseInt(data.nikashiPkt || 0);
        const tayariPkt = parseInt(data.tayariPkt || 0);

        // Fetch rates and calculate expenses
        if (data.unloadingLabour === undefined || data.unloadingLabour === 0 || data.unloadingLabour === null) {
            const rateObj = await UnloadingRate.findOne({ where: { locationId, itemId, isActive: true } });
            if (rateObj) {
                // Use nikashiPkt if available, otherwise salePkt
                const count = nikashiPkt > 0 ? nikashiPkt : salePkt;
                data.unloadingLabour = (parseFloat(rateObj.rate) * count).toFixed(2);
            }
        }

        if (data.tayaroLabour === undefined || data.tayaroLabour === 0 || data.tayaroLabour === null) {
            const rateObj = await TaiyariRate.findOne({ where: { locationId, itemId, isActive: true } });
            if (rateObj) {
                // Use tayariPkt if available, otherwise salePkt
                const count = tayariPkt > 0 ? tayariPkt : salePkt;
                data.tayaroLabour = (parseFloat(rateObj.rate) * count).toFixed(2);
            }
        }

        if (data.coldStorageRent === undefined || data.coldStorageRent === 0 || data.coldStorageRent === null) {
            const rateObj = await RentRate.findOne({ where: { locationId, itemId, isActive: true } });
            if (rateObj) {
                // Rent is usually on the packets taken out (nikashi)
                const count = nikashiPkt > 0 ? nikashiPkt : salePkt;
                data.coldStorageRent = (parseFloat(rateObj.rate) * count).toFixed(2);
            }
        }

        // Calculate amount
        const ratePerQtl = parseFloat(data.rate || 0);
        data.amount = (saleWt * ratePerQtl).toFixed(2);

        // Calculate total expenses
        const expenses = [
            'unloadingLabour', 'tayaroLabour', 'coldStorageRent',
            'newBags', 'sutli', 'pktCollection', 'raffuChipri'
        ];

        let totalExps = 0;
        expenses.forEach(exp => {
            totalExps += parseFloat(data[exp] || 0);
        });
        data.totalExpOnSales = totalExps.toFixed(2);

        // Calculate net result
        data.netResult = (parseFloat(data.amount) - totalExps).toFixed(2);

        const sale = await Sale.create(data);
        return await saleService.getById(sale.id);
    },

    /**
     * Update sale
     */
    update: async (id, data) => {
        const sale = await Sale.findOne({
            where: { id, isActive: true },
            include: [{ model: Purchase, as: 'purchase' }]
        });

        if (!sale) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Sale record not found');
        }

        // Recalculate fields
        const saleWt = parseFloat(data.saleWt !== undefined ? data.saleWt : sale.saleWt);
        const salePkt = parseInt(data.salePkt !== undefined ? data.salePkt : sale.salePkt);
        const rate = parseFloat(data.rate !== undefined ? data.rate : sale.rate);

        data.amount = (saleWt * rate).toFixed(2);

        const expFields = [
            'unloadingLabour', 'tayaroLabour', 'coldStorageRent',
            'newBags', 'sutli', 'pktCollection', 'raffuChipri'
        ];

        let totalExps = 0;
        expFields.forEach(field => {
            totalExps += parseFloat(data[field] !== undefined ? data[field] : sale[field]);
        });
        data.totalExpOnSales = totalExps.toFixed(2);

        data.netResult = (parseFloat(data.amount) - totalExps).toFixed(2);

        await sale.update(data);
        return await saleService.getById(id);
    },

    /**
     * Delete sale (Soft delete)
     */
    delete: async (id) => {
        const sale = await Sale.findOne({ where: { id, isActive: true } });
        if (!sale) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Sale record not found');
        }

        await sale.update({ isActive: false });
        return sale;
    }
};

export default saleService;

