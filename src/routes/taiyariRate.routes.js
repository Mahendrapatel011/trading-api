import express from 'express';
import taiyariRateController from '../controllers/taiyariRate.controller.js';
import taiyariRateValidator from '../validators/taiyariRate.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.get('/', authenticateToken, taiyariRateController.getAll);
router.get('/admin/all', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), taiyariRateController.getAllAdmin);
router.post('/', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(taiyariRateValidator.create), taiyariRateController.create);
router.put('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(taiyariRateValidator.update), taiyariRateController.update);
router.delete('/:id', authenticateToken, authorizeRoles(USER_ROLES.SUPER_ADMIN), validate(taiyariRateValidator.delete), taiyariRateController.delete);

export default router;
