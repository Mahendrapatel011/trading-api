import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const Sale = sequelize.define(
    'Sale',
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
        saleDt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        party: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        nikashiPkt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        tayariPkt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        charri: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        salePkt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        saleWt: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
            comment: 'Sale Weight in Quintals',
        },
        rate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Rate per Quintal',
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'saleWt * rate',
        },
        unloadingLabour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        tayaroLabour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        coldStorageRent: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        newBags: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        sutli: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        pktCollection: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        raffuChipri: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        totalExpOnSales: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Sum of all expenses',
        },
        netResult: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'amount - totalExpOnSales',
        },
        shortage: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'sales',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['purchase_id'],
            },
            {
                fields: ['sale_dt'],
            },
            {
                fields: ['party'],
            },
        ],
    }
);

export default Sale;
