"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      bookingId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      eventId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      bookedTickets: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings");
  },
};
