import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const Purchase = sequelize.define(
    'Purchase',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'locations',
                key: 'id',
            },
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Financial year for this purchase',
        },
        billDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        billNo: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        supplierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'suppliers',
                key: 'id',
            },
        },
        purchasedForId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'suppliers',
                key: 'id',
            },
            comment: 'Supplier ID for whom the goods were purchased',
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'items',
                key: 'id',
            },
        },
        agreementNo: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lotNo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Auto-calculated: agreementNo/noOfPacket',
        },
        noOfPacket: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        grWt: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
            comment: 'Gross Weight in Quintals',
        },
        cutting: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cutting weight in Quintals',
        },
        netWt: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
            comment: 'Net Weight (grWt - cutting) in Quintals',
        },
        rate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Rate per Quintal',
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'netWt * rate',
        },
        loadingLabour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        totalCost: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'amount + loadingLabour',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'purchases',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['location_id', 'year', 'bill_no'],
                name: 'unique_bill_per_location_year',
            },
            {
                unique: true,
                fields: ['location_id', 'year', 'agreement_no'],
                name: 'unique_agreement_per_location_year',
            },
            {
                fields: ['location_id', 'year'],
            },
            {
                fields: ['supplier_id'],
            },
            {
                fields: ['item_id'],
            },
            {
                fields: ['bill_date'],
            },
        ],
    }
);

export default Purchase;
