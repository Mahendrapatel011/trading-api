import { Purchase, Sale } from '../models/index.js';
import { Op } from 'sequelize';

const dashboardService = {
    /**
     * Get dashboard stats for a location and year
     */
    getStats: async (locationId, year) => {
        const wherePurchase = { isActive: true };
        if (locationId) wherePurchase.locationId = locationId;
        if (year) wherePurchase.year = year;

        // Fetch all active purchases
        const purchases = await Purchase.findAll({
            where: wherePurchase,
            attributes: ['noOfPacket', 'netWt', 'totalCost']
        });

        // Calculate Purchase stats
        const purchaseStats = purchases.reduce((acc, p) => {
            acc.bags += parseInt(p.noOfPacket || 0);
            acc.weight += parseFloat(p.netWt || 0);
            acc.amount += parseFloat(p.totalCost || 0);
            return acc;
        }, { bags: 0, weight: 0, amount: 0 });

        // Fetch all sales for these purchases
        const purchaseIds = purchases.map(p => p.id);
        const sales = await Sale.findAll({
            where: {
                purchaseId: { [Op.in]: purchaseIds },
                isActive: true
            },
            attributes: ['salePkt', 'saleWt', 'amount']
        });

        // Calculate Sale stats
        const saleStats = sales.reduce((acc, s) => {
            acc.bags += parseInt(s.salePkt || 0);
            acc.weight += parseFloat(s.saleWt || 0);
            acc.amount += parseFloat(s.amount || 0);
            return acc;
        }, { bags: 0, weight: 0, amount: 0 });

        // Calculate Stock stats
        const stockStats = {
            bags: purchaseStats.bags - saleStats.bags,
            weight: purchaseStats.weight - saleStats.weight,
            amount: purchaseStats.amount - saleStats.amount // This is value of stock in hand? 
            // Or just purchase price - sale price? 
            // Usually it's remaining stock weight * avg purchase rate.
            // But simple difference is also a metric.
        };

        return {
            purchase: purchaseStats,
            sales: saleStats,
            stock: stockStats
        };
    }
};

export default dashboardService;
