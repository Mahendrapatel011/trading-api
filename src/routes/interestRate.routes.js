import express from 'express';
import interestRateController from '../controllers/interestRate.controller.js';
import interestRateValidator from '../validators/interestRate.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.get('/', authenticateToken, interestRateController.getAll);
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), interestRateController.getAllAdmin);
router.post('/', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(interestRateValidator.create), interestRateController.create);
router.put('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(interestRateValidator.update), interestRateController.update);
router.delete('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(interestRateValidator.delete), interestRateController.delete);

export default router;
