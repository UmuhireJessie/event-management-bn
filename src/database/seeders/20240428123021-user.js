"use strict";

const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

dotenv.config();
const saltRounds = Number(process.env.SALTROUNDS);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          userId: uuid(),
          firstName: "Jessie",
          lastName: "Umuhire",
          email: "umuhirejessie@gmail.com",
          phoneNumber: "250700000000",
          password: await bcrypt.hash("123@Pass", saltRounds),
          isVerified: true,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
