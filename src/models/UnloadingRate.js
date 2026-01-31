import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';
import Item from './Item.js';
import Unit from './Unit.js';
import location from './location.js';

const UnloadingRate = sequelize.define(
    'UnloadingRate',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'items',
                key: 'id',
            },
        },
        unitId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'units',
                key: 'id',
            },
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'locations',
                key: 'id',
            },
        },
        rate: {
            type: DataTypes.DECIMAL(10, 2),
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
        tableName: 'unloading_rates',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['item_id', 'unit_id', 'location_id'],
                name: 'unique_unloading_rate',
            },
            {
                fields: ['is_active'],
            },
        ],
    }
);

// Associations
UnloadingRate.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
UnloadingRate.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
UnloadingRate.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

export default UnloadingRate;
