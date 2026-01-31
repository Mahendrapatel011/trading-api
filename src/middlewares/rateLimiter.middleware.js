import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";
import User from "../models/User.js";
import { USER_ROLES } from "../constants/index.js";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: async (req) => {
        // Skip rate limiting for super admin users
        const { email } = req.body;
        if (email) {
            try {
                const user = await User.findOne({
                    where: { email: email.toLowerCase() },
                    attributes: ['role']
                });
                if (user && user.role === USER_ROLES.SUPER_ADMIN) {
                    return true; // Skip rate limiting
                }
            } catch (error) {
                // If error checking user, don't skip (apply rate limiting)
                return false;
            }
        }
        return false; // Apply rate limiting for other users
    },
    handler: (req, res) => {
        throw new ApiError(
            HTTP_STATUS.TOO_MANY_REQUESTS,
            "Too many login attempts. Please try again after 15 minutes"
        );
    }
});

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const strictRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Rate limit exceeded. Please try again after an hour"
    },
    standardHeaders: true,
    legacyHeaders: false
});