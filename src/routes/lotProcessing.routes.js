import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import lotProcessingValidator from '../validators/lotProcessing.validator.js';
import lotProcessingController from '../controllers/lotProcessing.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router
    .route('/')
    .post(validate(lotProcessingValidator.create), lotProcessingController.createLotProcessing)
    .get(lotProcessingController.getLotProcessings);

router
    .route('/:id')
    .get(validate(lotProcessingValidator.getById), lotProcessingController.getLotProcessing)
    .patch(validate(lotProcessingValidator.update), lotProcessingController.updateLotProcessing)
    .delete(validate(lotProcessingValidator.delete), lotProcessingController.deleteLotProcessing);

router
    .route('/purchase/:purchaseId')
    .get(validate(lotProcessingValidator.getByPurchase), lotProcessingController.getLotProcessingsByPurchase);

export default router;
