import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';

const location = sequelize.define(
  'location',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nameHindi: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    addressHindi: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    officeHindi: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '',
    },
    managerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'locations',
    timestamps: true,
    underscored: true,
  }
);

export default location;

