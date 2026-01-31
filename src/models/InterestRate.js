import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';
import location from './location.js';

const InterestRate = sequelize.define(
    'InterestRate',
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
        rate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Annual interest rate in percentage'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'interest_rates',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['location_id'],
                name: 'unique_location_interest_rate',
            },
            {
                fields: ['is_active'],
            },
        ],
    }
);

// Associations
InterestRate.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

export default InterestRate;
