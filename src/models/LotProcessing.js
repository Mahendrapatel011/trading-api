import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const LotProcessing = sequelize.define(
    'LotProcessing',
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
        processingDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        nikashiPkt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        purchaseCost: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        nikashiLabour: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        tayariLabour: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        rent: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        newBags: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        sutli: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        pktCollection: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        raffuChippi: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        totalExps: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        tayariPkt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        charriPkt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'lot_processings',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['purchase_id'],
            },
            {
                fields: ['processing_date'],
            },
        ],
    }
);

export default LotProcessing;
