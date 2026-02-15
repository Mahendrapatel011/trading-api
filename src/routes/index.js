import { Router } from 'express';
import authRoutes from './auth.routes.js';
import itemRoutes from './item.routes.js';
import userRoutes from './user.routes.js';
import locationRoutes from './location.routes.js';
import unitRoutes from './unit.routes.js';
import rentRateRoutes from './rentRate.routes.js';
import loadingRateRoutes from './loadingRate.routes.js';
import unloadingRateRoutes from './unloadingRate.routes.js';
import taiyariRateRoutes from './taiyariRate.routes.js';
import interestRateRoutes from './interestRate.routes.js';
import supplierRoutes from './supplier.routes.js';
import purchaseRoutes from './purchase.routes.js';
import saleRoutes from './sale.routes.js';
import loanRoutes from './loan.routes.js';
import lotProcessingRoutes from './lotProcessing.routes.js';


const router = Router();

// Auth
router.use('/auth', authRoutes);

// User Management (super admin)
router.use('/users', userRoutes);

// location Management (super admin)
router.use('/locations', locationRoutes);

// Master Data (Items, Units, Rates)
router.use('/items', itemRoutes);
router.use('/units', unitRoutes);
router.use('/rent-rates', rentRateRoutes);
router.use('/loading-rates', loadingRateRoutes);
router.use('/unloading-rates', unloadingRateRoutes);
router.use('/taiyari-rates', taiyariRateRoutes);
router.use('/interest-rates', interestRateRoutes);
router.use('/suppliers', supplierRoutes);

// Transactions
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/loans', loanRoutes);
router.use('/lot-processings', lotProcessingRoutes);


export default router;