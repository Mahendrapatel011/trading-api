import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';
import Item from './Item.js';
import Unit from './Unit.js';
import location from './location.js';

const RentRate = sequelize.define(
  'RentRate',
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
    tableName: 'rent_rates',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['item_id', 'unit_id', 'location_id'],
        name: 'unique_rent_rate',
      },
      {
        fields: ['is_active'],
      },
    ],
  }
);

// Associations
RentRate.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
RentRate.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
RentRate.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

export default RentRate;

