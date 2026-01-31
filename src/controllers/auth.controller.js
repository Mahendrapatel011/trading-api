import AuthService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import { SUCCESS_MESSAGES } from '../constants/index.js';
import { APP_CONFIG } from '../config/app.config.js';
import logger from '../utils/logger.js';

const cookieOptions = {
    httpOnly: true,
    secure: APP_CONFIG.NODE_ENV === "production",
    sameSite: APP_CONFIG.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};
const ACCESS_TOKEN_MAX_AGE = 48 * 60 * 60 * 1000;
class AuthController {
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Log login attempt (without password)
        logger.info(`Login attempt for email: ${email || 'missing'}`);

        const { user, accessToken, refreshToken } = await AuthService.login(email, password);

        res
            .status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: ACCESS_TOKEN_MAX_AGE
            })
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user,
                        accessToken,
                        refreshToken
                    },
                    SUCCESS_MESSAGES.LOGIN_SUCCESS
                )
            );
    });

    refreshToken = asyncHandler(async (req, res) => {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        const { accessToken, refreshToken } = await AuthService.refreshAccessToken(incomingRefreshToken);

        res
            .status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: ACCESS_TOKEN_MAX_AGE
            })
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    SUCCESS_MESSAGES.TOKEN_REFRESHED
                )
            );
    });

    logout = asyncHandler(async (req, res) => {
        await AuthService.logout(req.user.id);

        res
            .status(200)
            .clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions)
            .json(new ApiResponse(200, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS));
    });

    changePassword = asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;

        const { accessToken, refreshToken } = await AuthService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        res
            .status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: ACCESS_TOKEN_MAX_AGE
            })
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    SUCCESS_MESSAGES.PASSWORD_CHANGED
                )
            );
    });

    getCurrentUser = asyncHandler(async (req, res) => {
        const user = await AuthService.getCurrentUser(req.user.id);

        res.status(200).json(new ApiResponse(200, { user }, 'User fetched successfully'));
    });

    verifyToken = asyncHandler(async (req, res) => {
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: req.user,
                    isAuthenticated: true
                },
                "Token is valid"
            )
        );
    });
}

export default new AuthController();