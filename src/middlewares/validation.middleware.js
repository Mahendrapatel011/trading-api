import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg
        }));

        // Log validation errors for debugging
        logger.warn(`Validation failed for ${req.method} ${req.originalUrl}:`, {
            errors: extractedErrors,
            body: req.body
        });

        throw new ApiError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            ERROR_MESSAGES.VALIDATION_ERROR,
            extractedErrors
        );
    }

    next();
};

export default validate;