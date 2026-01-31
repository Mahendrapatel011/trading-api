import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../config/app.config.js';
import { USER_ROLES, USER_STATUS } from '../constants/index.js';
import location from './location.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: true, // null for super_admin
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(USER_ROLES)),
      allowNull: false,
      defaultValue: USER_ROLES.STAFF,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(USER_STATUS)),
      allowNull: false,
      defaultValue: USER_STATUS.ACTIVE,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, APP_CONFIG.BCRYPT_SALT_ROUNDS);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, APP_CONFIG.BCRYPT_SALT_ROUNDS);
        }
      },
    },
  }
);

// Define associations
User.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      role: this.role,
      locationId: this.locationId,
      fullName: `${this.firstName} ${this.lastName}`,
    },
    APP_CONFIG.JWT_ACCESS_SECRET,
    { expiresIn: APP_CONFIG.JWT_ACCESS_EXPIRY }
  );
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign(
    { id: this.id },
    APP_CONFIG.JWT_REFRESH_SECRET,
    { expiresIn: APP_CONFIG.JWT_REFRESH_EXPIRY }
  );
};

export default User;

