import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { loginRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
    loginValidator,
    changePasswordValidator,
    refreshTokenValidator
} from "../validators/auth.validator.js";

const router = Router();

router.post(
    "/login",
    loginRateLimiter,
    loginValidator,
    validate,
    AuthController.login
);

router.post(
    "/refresh-token",
    refreshTokenValidator,
    validate,
    AuthController.refreshToken
);

router.post(
    "/logout",
    authenticateToken,
    AuthController.logout
);

router.post(
    "/change-password",
    authenticateToken,
    changePasswordValidator,
    validate,
    AuthController.changePassword
);

router.get(
    "/me",
    authenticateToken,
    AuthController.getCurrentUser
);

router.get(
    "/verify",
    authenticateToken,
    AuthController.verifyToken
);

export default router;