import express from 'express';
import unloadingRateController from '../controllers/unloadingRate.controller.js';
import unloadingRateValidator from '../validators/unloadingRate.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.get('/', authenticateToken, unloadingRateController.getAll);
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), unloadingRateController.getAllAdmin);
router.post('/', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(unloadingRateValidator.create), unloadingRateController.create);
router.put('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(unloadingRateValidator.update), unloadingRateController.update);
router.delete('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(unloadingRateValidator.delete), unloadingRateController.delete);

export default router;
