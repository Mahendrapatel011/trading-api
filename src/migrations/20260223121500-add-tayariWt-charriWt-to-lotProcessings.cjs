'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableInfo = await queryInterface.describeTable('lot_processings');

        // Add tayari_wt and charri_wt to lot_processings table
        if (!tableInfo.tayari_wt) {
            await queryInterface.addColumn('lot_processings', 'tayari_wt', {
                type: Sequelize.DECIMAL(12, 3),
                allowNull: false,
                defaultValue: 0,
            });
        }

        if (!tableInfo.charri_wt) {
            await queryInterface.addColumn('lot_processings', 'charri_wt', {
                type: Sequelize.DECIMAL(12, 3),
                allowNull: false,
                defaultValue: 0,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('lot_processings', 'tayari_wt');
        await queryInterface.removeColumn('lot_processings', 'charri_wt');
    }
};
