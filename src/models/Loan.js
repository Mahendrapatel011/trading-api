import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const Loan = sequelize.define(
    'Loan',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        purchaseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'purchases',
                key: 'id',
            },
        },
        loanDt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        loanAmount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        repaymentDt: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        interest: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        payRecd: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        netDues: {
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
        tableName: 'loans',
        timestamps: true,
        underscored: true,
    }
);

export default Loan;
