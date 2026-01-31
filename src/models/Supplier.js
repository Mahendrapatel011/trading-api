import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const Supplier = sequelize.define(
    'Supplier',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        mobileNo: {
            type: DataTypes.STRING(15),
            allowNull: true,
            defaultValue: '',
        },
        whatsappNo: {
            type: DataTypes.STRING(15),
            allowNull: true,
            defaultValue: '',
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        aadharCard: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: '',
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: '',
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'locations',
                key: 'id',
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'suppliers',
        timestamps: true,
        underscored: true,
    }
);

export default Supplier;
