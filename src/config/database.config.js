import { Sequelize } from 'sequelize';
import { APP_CONFIG } from './app.config.js';
import logger from '../utils/logger.js';

const sequelize = new Sequelize(
  APP_CONFIG.POSTGRES_DB,
  APP_CONFIG.POSTGRES_USER,
  APP_CONFIG.POSTGRES_PASSWORD,
  {
    host: APP_CONFIG.POSTGRES_HOST,
    port: APP_CONFIG.POSTGRES_PORT,
    dialect: 'postgres',
    logging: (msg) => {
      if (APP_CONFIG.NODE_ENV === 'development') {
        logger.debug(msg);
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ PostgreSQL connected successfully via Sequelize');

    // Sync all models (create tables if they don't exist)
    // In production, use migrations instead
    // Note: After running migrations, sync will skip index creation if they already exist
    // Sync all models (create tables if they don't exist)
    // Use alter: true to update tables to match models
    try {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database tables synchronized');
    } catch (error) {
      logger.error('❌ Database sync error:', error.message);
    }

    return sequelize;
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await sequelize.close();
  logger.info('PostgreSQL connection closed due to app termination');
  process.exit(0);
});

export default connectDatabase;
export { sequelize };
