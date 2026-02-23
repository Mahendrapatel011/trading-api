'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableInfo = await queryInterface.describeTable('sales');

        if (!tableInfo.sale_type) {
            await queryInterface.addColumn('sales', 'sale_type', {
                type: Sequelize.ENUM('Taiyari', 'Charri'),
                allowNull: false,
                defaultValue: 'Taiyari',
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('sales', 'sale_type');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sales_sale_type";');
    }
};
