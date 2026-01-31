import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import location from '../models/location.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import { APP_CONFIG } from '../config/app.config.js';
import { HTTP_STATUS, ERROR_MESSAGES, USER_STATUS } from '../constants/index.js';
import logger from '../utils/logger.js';

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }

  try {
    // Verify JWT token
    if (!APP_CONFIG.JWT_ACCESS_SECRET) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'JWT secret not configured');
    }

    const decoded = jwt.verify(accessToken, APP_CONFIG.JWT_ACCESS_SECRET);

    // Find user with location info
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: location,
          as: 'location',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (!user) {
      logger.warn(`User not found for token - User ID: ${decoded.id}`);
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === USER_STATUS.INACTIVE) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_INACTIVE);
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_SUSPENDED);
    }

    // Attach user to request
    req.user = user;
    req.userRole = user.role;

    // ✅ NEW: Check for impersonation header (X-location-Id)
    const impersonatedlocationId = req.header('X-location-Id');

    if (impersonatedlocationId && user.role === 'super_admin') {
      // Super admin is impersonating a location
      const locationId = parseInt(impersonatedlocationId);

      if (!isNaN(locationId) && locationId > 0) {
        // Verify location exists
        const foundLocation = await location.findByPk(locationId);

        if (foundLocation) {
          req.locationId = locationId;
          req.isImpersonating = true;
          req.impersonatedlocation = foundLocation;

          if (APP_CONFIG.NODE_ENV === 'development') {
            console.log('Auth middleware - Super Admin IMPERSONATING:', {
              userId: user.id,
              email: user.email,
              role: user.role,
              impersonatedlocationId: locationId,
              impersonatedlocationName: location.name
            });
          }
        } else {
          // location not found, but don't fail - just use null
          console.warn(`Impersonation failed: location ${locationId} not found`);
          req.locationId = null;
        }
      } else {
        req.locationId = null;
      }
    } else {
      // Normal flow - use user's location
      req.locationId = user.locationId;
    }

    // Log for debugging (only in development)
    if (APP_CONFIG.NODE_ENV === 'development' && !req.isImpersonating) {
      console.log('Auth middleware - User authenticated:', {
        userId: user.id,
        email: user.email,
        role: user.role,
        locationId: req.locationId,
        locationName: user.location?.name || 'N/A'
      });
    }

    // Warn if non-super admin user doesn't have locationId
    if (user.role !== 'super_admin' && !req.locationId) {
      console.warn(`WARNING: User ${user.email} (ID: ${user.id}) does not have a location assigned!`);
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID);
    }
    throw error;
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }
    next();
  };
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(accessToken, APP_CONFIG.JWT_ACCESS_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: location,
          as: 'location',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (user && user.status === USER_STATUS.ACTIVE) {
      req.user = user;
      req.userRole = user.role;

      // ✅ Handle impersonation for optional auth too
      const impersonatedlocationId = req.header('X-location-Id');

      if (impersonatedlocationId && user.role === 'super_admin') {
        const locationId = parseInt(impersonatedlocationId);
        if (!isNaN(locationId) && locationId > 0) {
          req.locationId = locationId;
          req.isImpersonating = true;
        } else {
          req.locationId = user.locationId;
        }
      } else {
        req.locationId = user.locationId;
      }
    }
  } catch (error) {
    // Token invalid - continue without user
  }

  next();
});

// ✅ NEW: Helper middleware to require location ID
export const requirelocation = (req, res, next) => {
  if (!req.locationId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'location ID is required');
  }
  next();
};