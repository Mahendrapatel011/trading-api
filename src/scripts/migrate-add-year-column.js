/**
 * Migration Script: Add year column to all tables
 * 
 * This script:
 * 1. Adds 'year' column to document_counters table
 * 2. Adds 'year' column to reservations table
 * 3. Adds 'year' column to agreements table
 * 4. Adds 'year' column to cash_receipts table
 * 5. Updates existing data with year from date columns
 * 6. Updates unique constraints to include year
 * 
 * Run: node src/scripts/migrate-add-year-column.js
 */

import { sequelize } from '../config/database.config.js';
import { QueryTypes } from 'sequelize';

const runMigration = async () => {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Adding year column to all tables...\n');

    // 1. Add year column to document_counters
    console.log('1. Adding year column to document_counters...');
    try {
      await sequelize.query(`
        ALTER TABLE document_counters 
        ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
      `, { transaction });

      // Update existing records with current year
      await sequelize.query(`
        UPDATE document_counters 
        SET year = EXTRACT(YEAR FROM CURRENT_DATE)
        WHERE year IS NULL OR year = 0;
      `, { transaction });

      console.log('   ✓ document_counters updated');
    } catch (error) {
      console.error('   ✗ Error updating document_counters:', error.message);
      throw error;
    }

    // 2. Drop old unique constraint and add new one with year
    console.log('2. Updating unique constraint on document_counters...');
    try {
      // Drop old constraint if exists
      await sequelize.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'document_counters_location_id_document_type_key'
          ) THEN
            ALTER TABLE document_counters 
            DROP CONSTRAINT document_counters_location_id_document_type_key;
          END IF;
        END $$;
      `, { transaction });

      // Add new unique constraint with year
      await sequelize.query(`
        ALTER TABLE document_counters 
        ADD CONSTRAINT document_counters_location_id_document_type_year_key 
        UNIQUE (location_id, document_type, year);
      `, { transaction });

      console.log('   ✓ document_counters unique constraint updated');
    } catch (error) {
      console.error('   ✗ Error updating constraint:', error.message);
      throw error;
    }

    // 3. Add year column to reservations
    console.log('3. Adding year column to reservations...');
    try {
      await sequelize.query(`
        ALTER TABLE reservations 
        ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
      `, { transaction });

      // Update existing records with year from reservation_date
      await sequelize.query(`
        UPDATE reservations 
        SET year = EXTRACT(YEAR FROM reservation_date)
        WHERE year IS NULL OR year = 0;
      `, { transaction });

      console.log('   ✓ reservations updated');
    } catch (error) {
      console.error('   ✗ Error updating reservations:', error.message);
      throw error;
    }

    // 4. Update unique constraint on reservations
    console.log('4. Updating unique constraint on reservations...');
    try {
      // Drop old constraint if exists
      await sequelize.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'reservations_location_id_reservation_no_key'
          ) THEN
            ALTER TABLE reservations 
            DROP CONSTRAINT reservations_location_id_reservation_no_key;
          END IF;
        END $$;
      `, { transaction });

      // Add new unique constraint with year
      await sequelize.query(`
        ALTER TABLE reservations 
        ADD CONSTRAINT reservations_location_id_reservation_no_year_key 
        UNIQUE (location_id, reservation_no, year);
      `, { transaction });

      // Add index on year
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_reservations_location_year 
        ON reservations(location_id, year);
      `, { transaction });

      console.log('   ✓ reservations unique constraint updated');
    } catch (error) {
      console.error('   ✗ Error updating constraint:', error.message);
      throw error;
    }

    // 5. Add year column to agreements
    console.log('5. Adding year column to agreements...');
    try {
      await sequelize.query(`
        ALTER TABLE agreements 
        ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
      `, { transaction });

      // Update existing records with year from agreement_date
      await sequelize.query(`
        UPDATE agreements 
        SET year = EXTRACT(YEAR FROM agreement_date)
        WHERE year IS NULL OR year = 0;
      `, { transaction });

      console.log('   ✓ agreements updated');
    } catch (error) {
      console.error('   ✗ Error updating agreements:', error.message);
      throw error;
    }

    // 6. Update unique constraint on agreements
    console.log('6. Updating unique constraint on agreements...');
    try {
      // Drop old constraint if exists
      await sequelize.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'agreements_location_id_agreement_no_key'
          ) THEN
            ALTER TABLE agreements 
            DROP CONSTRAINT agreements_location_id_agreement_no_key;
          END IF;
        END $$;
      `, { transaction });

      // Add new unique constraint with year
      await sequelize.query(`
        ALTER TABLE agreements 
        ADD CONSTRAINT agreements_location_id_agreement_no_year_key 
        UNIQUE (location_id, agreement_no, year);
      `, { transaction });

      // Add index on year
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_agreements_location_year 
        ON agreements(location_id, year);
      `, { transaction });

      console.log('   ✓ agreements unique constraint updated');
    } catch (error) {
      console.error('   ✗ Error updating constraint:', error.message);
      throw error;
    }

    // 7. Add year column to cash_receipts
    console.log('7. Adding year column to cash_receipts...');
    try {
      await sequelize.query(`
        ALTER TABLE cash_receipts 
        ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
      `, { transaction });

      // Update existing records with year from cash_receipt_date
      await sequelize.query(`
        UPDATE cash_receipts 
        SET year = EXTRACT(YEAR FROM cash_receipt_date)
        WHERE year IS NULL OR year = 0;
      `, { transaction });

      console.log('   ✓ cash_receipts updated');
    } catch (error) {
      console.error('   ✗ Error updating cash_receipts:', error.message);
      throw error;
    }

    // 8. Update unique constraint on cash_receipts
    console.log('8. Updating unique constraint on cash_receipts...');
    try {
      // Drop old constraint if exists
      await sequelize.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'cash_receipts_location_id_receipt_no_key'
          ) THEN
            ALTER TABLE cash_receipts 
            DROP CONSTRAINT cash_receipts_location_id_receipt_no_key;
          END IF;
        END $$;
      `, { transaction });

      // Add new unique constraint with year
      await sequelize.query(`
        ALTER TABLE cash_receipts 
        ADD CONSTRAINT cash_receipts_location_id_receipt_no_year_key 
        UNIQUE (location_id, receipt_no, year);
      `, { transaction });

      // Add index on year
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_cash_receipts_location_year 
        ON cash_receipts(location_id, year);
      `, { transaction });

      console.log('   ✓ cash_receipts unique constraint updated');
    } catch (error) {
      console.error('   ✗ Error updating constraint:', error.message);
      throw error;
    }

    await transaction.commit();
    console.log('\n✅ Migration completed successfully!');
    console.log('\nAll tables now have year-based isolation:');
    console.log('  - document_counters: (location_id, document_type, year)');
    console.log('  - reservations: (location_id, reservation_no, year)');
    console.log('  - agreements: (location_id, agreement_no, year)');
    console.log('  - cash_receipts: (location_id, receipt_no, year)');

  } catch (error) {
    await transaction.rollback();
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run migration
runMigration();

