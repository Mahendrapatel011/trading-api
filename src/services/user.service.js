import { Op } from 'sequelize';
import User from '../models/User.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS, USER_ROLES } from '../constants/index.js';

const userService = {
  /**
   * Create a new user (only super admin can do this)
   */
  create: async (data, createdBy) => {
    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
    }

    // Convert locationId to integer if it's a string
    let locationId = data.locationId;
    if (locationId && typeof locationId === 'string') {
      locationId = parseInt(locationId);
      if (isNaN(locationId)) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid location ID format');
      }
    }

    // If locationId is provided, verify it exists
    if (locationId) {
      const foundLocation = await location.findByPk(locationId);
      if (!foundLocation) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, `location with ID ${locationId} not found`);
      }
      // Update data with validated locationId
      data.locationId = locationId;
    }

    // Super admin cannot have locationId
    if (data.role === USER_ROLES.SUPER_ADMIN && data.locationId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Super admin cannot be assigned to a location');
    }

    // Non-super admin must have locationId
    if (data.role !== USER_ROLES.SUPER_ADMIN && !data.locationId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'location is required for non-super admin users');
    }

    // Auto-generate numerical code if not provided
    if (!data.code) {
      const allUsers = await User.findAll({
        order: [['code', 'ASC']],
      });

      // Extract numeric codes
      const numericCodes = allUsers
        .map(u => {
          const num = parseInt(u.code);
          return isNaN(num) ? 0 : num;
        })
        .filter(num => num > 0);

      // Find next available number
      let nextCode = 1;
      if (numericCodes.length > 0) {
        const maxCode = Math.max(...numericCodes);
        nextCode = maxCode + 1;
      }

      data.code = nextCode.toString();
    }

    console.log('Creating user with data:', {
      email: data.email,
      code: data.code,
      locationId: data.locationId,
      role: data.role,
      locationIdType: typeof data.locationId
    });

    const user = await User.create({
      ...data,
      createdBy: createdBy?.id,
    });

    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      locationId: user.locationId
    });

    return user;
  },

  /**
   * Get all users (super admin sees all, others see only their location)
   */
  getAll: async (locationId, role) => {
    const where = {};

    // If not super admin, filter by location
    if (role !== USER_ROLES.SUPER_ADMIN && locationId) {
      where.locationId = locationId;
    }

    const users = await User.findAll({
      where,
      include: [
        {
          model: location,
          as: 'location',
          attributes: ['id', 'name', 'code'],
        },
      ],
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [['createdAt', 'DESC']],
    });

    return users;
  },

  /**
   * Get user by ID
   */
  getById: async (id, locationId, role) => {
    const where = { id };

    // If not super admin, filter by location
    if (role !== USER_ROLES.SUPER_ADMIN && locationId) {
      where.locationId = locationId;
    }

    const user = await User.findOne({
      where,
      include: [
        {
          model: location,
          as: 'location',
          attributes: ['id', 'name', 'code'],
        },
      ],
      attributes: { exclude: ['password', 'refreshToken'] },
    });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return user;
  },

  /**
   * Update user
   */
  update: async (id, data, locationId, role) => {
    const where = { id };

    // If not super admin, filter by location
    if (role !== USER_ROLES.SUPER_ADMIN && locationId) {
      where.locationId = locationId;
    }

    const user = await User.findOne({ where });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    // If locationId is being changed, verify it exists
    if (data.locationId !== undefined) {
      if (data.locationId) {
        const foundLocation = await location.findByPk(data.locationId);
        if (!foundLocation) {
          throw new ApiError(HTTP_STATUS.NOT_FOUND, 'location not found');
        }
      }

      // Super admin cannot have locationId
      if (data.role === USER_ROLES.SUPER_ADMIN && data.locationId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Super admin cannot be assigned to a location');
      }

      // Non-super admin must have locationId
      if (data.role !== USER_ROLES.SUPER_ADMIN && !data.locationId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'location is required for non-super admin users');
      }
    }

    await user.update(data);

    return user;
  },

  /**
   * Delete user (hard delete - permanently removes user from database)
   */
  delete: async (id, locationId, role) => {
    const where = { id };

    // If not super admin, filter by location
    if (role !== USER_ROLES.SUPER_ADMIN && locationId) {
      where.locationId = locationId;
    }

    const user = await User.findOne({ where });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    // Don't allow deleting super admin
    if (user.role === USER_ROLES.SUPER_ADMIN) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot delete super admin');
    }

    // Hard delete - permanently remove user from database
    await user.destroy();

    return user;
  },
};

export default userService;

