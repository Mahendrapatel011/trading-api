import { Loan, Purchase } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';

const loanService = {
    /**
     * Create a new loan entry
     */
    create: async (data) => {
        const loanAmount = parseFloat(data.loanAmount || 0);
        const interest = parseFloat(data.interest || 0);
        const payRecd = parseFloat(data.payRecd || 0);

        data.netDues = (loanAmount + interest - payRecd).toFixed(2);

        return await Loan.create(data);
    },

    /**
     * Update a loan entry
     */
    update: async (id, data) => {
        const loan = await Loan.findByPk(id);
        if (!loan) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Loan entry not found');
        }

        const loanAmount = parseFloat(data.loanAmount !== undefined ? data.loanAmount : loan.loanAmount);
        const interest = parseFloat(data.interest !== undefined ? data.interest : loan.interest);
        const payRecd = parseFloat(data.payRecd !== undefined ? data.payRecd : loan.payRecd);

        data.netDues = (loanAmount + interest - payRecd).toFixed(2);

        await loan.update(data);
        return loan;
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
        return loan;
    },

    /**
     * Get all loans for a purchase
     */
    getByPurchase: async (purchaseId) => {
        return await Loan.findAll({
            where: { purchaseId, isActive: true },
            order: [['loanDt', 'ASC']]
        });
    }
};

export default loanService;
