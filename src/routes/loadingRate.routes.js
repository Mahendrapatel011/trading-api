import express from 'express';
import loadingRateController from '../controllers/loadingRate.controller.js';
import loadingRateValidator from '../validators/loadingRate.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.get('/', authenticateToken, loadingRateController.getAll);
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), loadingRateController.getAllAdmin);
router.post('/', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(loadingRateValidator.create), loadingRateController.create);
router.put('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(loadingRateValidator.update), loadingRateController.update);
router.delete('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(loadingRateValidator.delete), loadingRateController.delete);

export default router;
