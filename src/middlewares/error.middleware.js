import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { APP_CONFIG } from "../config/app.config.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

export const notFoundHandler = (req, res, next) => {
    const error = new ApiError(
        HTTP_STATUS.NOT_FOUND,
        `${ERROR_MESSAGES.ROUTE_NOT_FOUND}: ${req.originalUrl}`
    );
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
        const message = error.message || ERROR_MESSAGES.SERVER_ERROR;
        error = new ApiError(statusCode, message, [], err.stack);
    }

    if (err.name === "CastError") {
        error = new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new ApiError(
            HTTP_STATUS.CONFLICT,
            `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        );
    }

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message
        }));
        error = new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation Error", errors);
    }

    logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method}`);

    const response = {
        success: false,
        message: error.message,
        ...(error.errors.length > 0 && { errors: error.errors }),
        ...(APP_CONFIG.NODE_ENV === "development" && { stack: error.stack })
    };

    res.status(error.statusCode).json(response);
};