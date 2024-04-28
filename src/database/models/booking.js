'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    bookingId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bookedTickets: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};