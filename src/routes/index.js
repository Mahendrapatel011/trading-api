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

export default router;