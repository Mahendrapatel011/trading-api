import { Loan, Purchase, Item, Supplier, LoanRepayment } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const loanService = {
    /**
     * Create a new loan entry
     */
    create: async (data) => {
        const loanAmount = parseFloat(data.loanAmount || 0);
        const interest = parseFloat(data.interest || 0);

        // Clean up dates - if empty string, set to null
        if (!data.repaymentDt) data.repaymentDt = null;
        if (!data.loanDt) data.loanDt = null;

        // Calculate total payRecd from repayments if provided
        let payRecd = 0;
        if (data.repayments && data.repayments.length > 0) {
            payRecd = data.repayments.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        } else {
            payRecd = parseFloat(data.payRecd || 0);
        }

        data.payRecd = payRecd.toFixed(2);
        data.netDues = (loanAmount + interest - payRecd).toFixed(2);

        const loan = await Loan.create(data);

        // Create repayment records if provided
        if (data.repayments && data.repayments.length > 0) {
            const validRepayments = data.repayments.filter(r => r.amount && parseFloat(r.amount) > 0);
            if (validRepayments.length > 0) {
                const repaymentsData = validRepayments.map(r => ({
                    ...r,
                    loanId: loan.id
                }));
                await LoanRepayment.bulkCreate(repaymentsData);

                // Update main loan record with the latest repayment date
                const latestDt = validRepayments.reduce((latest, r) => {
                    return (!latest || r.repaymentDt > latest) ? r.repaymentDt : latest;
                }, '');
                if (latestDt) {
                    await loan.update({ repaymentDt: latestDt });
                }
            }
        }

        return await Loan.findByPk(loan.id, {
            include: [
                { model: LoanRepayment, as: 'repayments', where: { isActive: true }, required: false },
                {
                    model: Purchase,
                    as: 'purchase',
                    include: [
                        { model: Supplier, as: 'supplier', attributes: ['name'] },
                        { model: Supplier, as: 'purchasedFor', attributes: ['name'] }
                    ]
                }
            ]
        });
    },

    /**
     * Update a loan entry
     */
    update: async (id, data) => {
        const loan = await Loan.findByPk(id, {
            include: [{ model: LoanRepayment, as: 'repayments', where: { isActive: true }, required: false }]
        });
        if (!loan) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Loan entry not found');
        }

        const loanAmount = parseFloat(data.loanAmount !== undefined ? data.loanAmount : loan.loanAmount);
        const interest = parseFloat(data.interest !== undefined ? data.interest : loan.interest);

        // Clean up dates
        if (data.repaymentDt === '') data.repaymentDt = null;
        if (data.loanDt === '') data.loanDt = null;

        // Handle repayments if provided
        if (data.repayments) {
            // Delete existing active repayments and create new ones
            await LoanRepayment.update({ isActive: false }, { where: { loanId: id } });
            const validRepayments = data.repayments.filter(r => r.amount && parseFloat(r.amount) > 0);

            if (validRepayments.length > 0) {
                const repaymentsData = validRepayments.map(r => ({
                    ...r,
                    loanId: id
                }));
                await LoanRepayment.bulkCreate(repaymentsData);

                // Set latest repayment date as the main repaymentDt
                const latestDt = validRepayments.reduce((latest, r) => {
                    return (!latest || r.repaymentDt > latest) ? r.repaymentDt : latest;
                }, '');
                if (latestDt) data.repaymentDt = latestDt;
            } else {
                data.repaymentDt = null;
            }
        }

        // Fetch updated repayments to calculate total payRecd
        const updatedRepayments = await LoanRepayment.findAll({ where: { loanId: id, isActive: true } });
        const payRecd = updatedRepayments.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

        data.payRecd = payRecd.toFixed(2);
        data.netDues = (loanAmount + interest - payRecd).toFixed(2);

        await loan.update(data);
        return await Loan.findByPk(id, {
            include: [
                { model: LoanRepayment, as: 'repayments', where: { isActive: true }, required: false },
                {
                    model: Purchase,
                    as: 'purchase',
                    include: [
                        { model: Supplier, as: 'supplier', attributes: ['name'] },
                        { model: Supplier, as: 'purchasedFor', attributes: ['name'] },
                        { model: Item, as: 'item', attributes: ['name'] }
                    ]
                }
            ]
        });
    },

    /**
     * Delete a loan entry
     */
    delete: async (id) => {
        const loan = await Loan.findByPk(id);
        if (!loan) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Loan entry not found');
        }
        await loan.update({ isActive: false });
        // Soft delete repayments too
        await LoanRepayment.update({ isActive: false }, { where: { loanId: id } });
        return loan;
    },

    /**
     * Get all loans for a purchase
     */
    getByPurchase: async (purchaseId) => {
        return await Loan.findAll({
            where: { purchaseId, isActive: true },
            include: [
                { model: LoanRepayment, as: 'repayments', where: { isActive: true }, required: false },
                {
                    model: Purchase,
                    as: 'purchase',
                    include: [
                        { model: Supplier, as: 'supplier', attributes: ['name'] },
                        { model: Supplier, as: 'purchasedFor', attributes: ['name'] }
                    ]
                }
            ],
            order: [['loanDt', 'ASC']]
        });
    },

    /**
     * Get all loans with purchase details
     */
    getAll: async (year) => {
        return await Loan.findAll({
            include: [
                { model: LoanRepayment, as: 'repayments', where: { isActive: true }, required: false },
                {
                    model: Purchase,
                    as: 'purchase',
                    where: { year, isActive: true },
                    include: [
                        { model: Supplier, as: 'supplier', attributes: ['name'] },
                        { model: Supplier, as: 'purchasedFor', attributes: ['name'] },
                        { model: Item, as: 'item', attributes: ['name'] }
                    ]
                }
            ],
            where: { isActive: true },
            order: [['loanDt', 'DESC']]
        });
    }
};

export default loanService;
