import connectDatabase from '../config/database.config.js'
import { initAssociations } from '../models/index.js'
import User from '../models/User.js'
import Unit from '../models/Unit.js'
import { USER_ROLES, USER_STATUS } from '../constants/index.js'
import logger from '../utils/logger.js'
import { sequelize } from '../config/database.config.js'

const seedAdmin = async () => {
  try {
    // Initialize model associations
    initAssociations()

    // Connect to database
    await connectDatabase()
    logger.info('✅ Connected to PostgreSQL database')
    
    await sequelize.sync({ alter: false });
    logger.info('✅ Database models synchronized');

    // 1. Seed Units (Bag and Quintal are fixed)
    logger.info('Seeding fixed units...');
    const fixedUnits = ['Bag', 'Quintal'];
    for (const unitName of fixedUnits) {
      const [unit, created] = await Unit.findOrCreate({
        where: { name: unitName },
        defaults: { isActive: true }
      });
      if (created) {
        logger.info(`✅ Unit created: ${unitName}`);
      } else {
        logger.info(`ℹ️ Unit already exists: ${unitName}`);
      }
    }

    // 2. Seed Super Admin
    const ADMIN_EMAIL = 'admin@trading.com';
    const ADMIN_PASSWORD = 'admin123';

    // Check if super admin already exists by email
    const existingAdmin = await User.findOne({
      where: { email: ADMIN_EMAIL },
    })

    if (existingAdmin) {
      logger.info('ℹ️  Super admin already exists')
      logger.info(`   Email: ${existingAdmin.email}`)
    } else {
      // Get the next sequence number for the 'code' field
      const lastUser = await User.findOne({
        order: [['code', 'DESC']],
        attributes: ['code'],
        where: {
          code: {
            [sequelize.Sequelize.Op.regexp]: '^[0-9]+$'
          }
        }
      });

      let nextCode = '101'; // Default starting code
      if (lastUser && lastUser.code) {
        const lastNum = parseInt(lastUser.code);
        if (!isNaN(lastNum)) {
          nextCode = (lastNum + 1).toString();
        }
      }

      // Create super admin
      const adminData = {
        firstName: 'Super',
        lastName: 'Admin',
        code: nextCode,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: USER_ROLES.SUPER_ADMIN,
        status: USER_STATUS.ACTIVE,
        locationId: null,
        phone: '0000000000'
      }

      const admin = await User.create(adminData)

      logger.info('✅ Super admin created successfully!')
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      logger.info(`📧 Email:    ${ADMIN_EMAIL}`)
      logger.info(`🔑 Password: ${ADMIN_PASSWORD}`)
      logger.info(`🔢 Code:     ${admin.code}`)
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }

    logger.info('✅ Seeding completed successfully!');
    process.exit(0)
  } catch (error) {
    logger.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedAdmin()
