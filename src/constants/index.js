export const USER_ROLES = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    MANAGER: "manager",
    STAFF: "staff"
};

export const USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended"
};

export const TOKEN_TYPES = {
    ACCESS: "access",
    REFRESH: "refresh"
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "Your account is inactive. Please contact administrator",
    USER_SUSPENDED: "Your account has been suspended",
    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",
    UNAUTHORIZED: "You are not authorized to access this resource",
    FORBIDDEN: "Access denied",
    VALIDATION_ERROR: "Validation failed",
    SERVER_ERROR: "Internal server error",
    ROUTE_NOT_FOUND: "Route not found"
};

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
    PASSWORD_CHANGED: "Password changed successfully"
};

import httpStatus from './httpStatus.js';
import messages from './messages.js';
import reservationConstants from './reservation.constants.js';

export default {
  httpStatus,
  messages,
  reservationConstants,
};