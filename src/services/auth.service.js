import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import { APP_CONFIG } from '../config/app.config.js';
import { HTTP_STATUS, ERROR_MESSAGES, USER_STATUS, USER_ROLES } from '../constants/index.js';
import logger from '../utils/logger.js';

class AuthService {
  async login(email, password) {
    if (!email) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email is required for login');
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [
        {
          model: location,
          as: 'location',
          attributes: ['id', 'name', 'code', 'nameHindi', 'addressHindi', 'officeHindi', 'managerName', 'phone'],
        },
      ],
    });

    if (!user) {
      logger.warn(`Login failed: User not found with email: ${email}`);
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    logger.info(`User found: ${user.email}, Status: ${user.status}, locationId: ${user.locationId}, location: ${user.location?.name || 'N/A'}`);

    // Warn if non-super admin user doesn't have locationId
    if (user.role !== USER_ROLES.SUPER_ADMIN && !user.locationId) {
      logger.warn(`WARNING: User ${user.email} (Role: ${user.role}) logged in without location assignment!`);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.status === USER_STATUS.INACTIVE) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_INACTIVE);
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_SUSPENDED);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.update({
      refreshToken,
      lastLogin: new Date(),
    });

    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, APP_CONFIG.JWT_REFRESH_SECRET);

      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID);
      }

      if (user.refreshToken !== refreshToken) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID);
      }

      if (user.status !== USER_STATUS.ACTIVE) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_INACTIVE);
      }

      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      await user.update({ refreshToken: newRefreshToken });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_EXPIRED);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID);
      }
      throw error;
    }
  }

  async logout(userId) {
    await User.update(
      { refreshToken: null },
      { where: { id: userId } }
    );

    return true;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.update({ refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: location,
          as: 'location',
          attributes: ['id', 'name', 'code', 'nameHindi', 'addressHindi', 'officeHindi', 'managerName', 'phone'],
        },
      ],
      attributes: { exclude: ['password', 'refreshToken'] },
    });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }
}

export default new AuthService();
