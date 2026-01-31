import app from './src/app.js';
import connectDatabase from './src/config/database.config.js';
import { APP_CONFIG } from './src/config/app.config.js';
import logger from './src/utils/logger.js';
import { initAssociations } from './src/models/index.js';

const startServer = async () => {
  try {
    // Initialize model associations
    initAssociations();
    
    // Connect to PostgreSQL
    await connectDatabase();
    logger.info('✅ PostgreSQL connected successfully via Sequelize');

    app.listen(APP_CONFIG.PORT, () => {
      logger.info(`🚀 Server running in ${APP_CONFIG.NODE_ENV} mode on port ${APP_CONFIG.PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
