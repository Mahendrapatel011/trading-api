import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const LotTransfer = sequelize.define(
    'LotTransfer',
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
        previousOwnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'suppliers',
                key: 'id',
            },
        },
        newOwnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'suppliers',
                key: 'id',
            },
        },
        previousRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        newRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        transferDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        noOfPacket: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        netWt: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
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
        },
    },
    {
        tableName: 'lot_transfers',
        timestamps: true,
        underscored: true,
    }
);

export default LotTransfer;
