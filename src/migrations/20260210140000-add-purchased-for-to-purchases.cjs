'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('purchases', 'purchased_for_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'suppliers',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Supplier ID for whom the goods were purchased'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('purchases', 'purchased_for_id');
    }
};
