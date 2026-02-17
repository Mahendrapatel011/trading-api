import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const LoanRepayment = sequelize.define(
    'LoanRepayment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        loanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'loans',
                key: 'id',
            },
        },
        repaymentType: {
            type: DataTypes.ENUM('INTEREST', 'PRINCIPAL', 'BOTH'),
            allowNull: false,
            defaultValue: 'BOTH'
        },
        repaymentDt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        remarks: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'loan_repayments',
        timestamps: true,
        underscored: true,
    }
);

export default LoanRepayment;
