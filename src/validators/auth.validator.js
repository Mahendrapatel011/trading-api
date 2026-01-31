import { body } from "express-validator";

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required. Please use your email address, not user ID.")
        .isEmail()
        .withMessage("Please provide a valid email address (e.g., user@example.com)")
        .custom((value) => {
            // Check if user is trying to login with a numeric ID instead of email
            if (!isNaN(value) && value.trim() !== '') {
                throw new Error("Please use your email address to login, not user ID. Email format: user@example.com");
            }
            return true;
        })
        .normalizeEmail(),
    
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long. If your password is shorter, please contact admin to reset it.")
];

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain uppercase, lowercase, number and special character"),
    
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
];

export const refreshTokenValidator = [
    body("refreshToken")
        .optional()
        .isString()
        .withMessage("Refresh token must be a string")
];