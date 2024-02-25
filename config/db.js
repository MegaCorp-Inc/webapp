const { Sequelize } = require("sequelize");
require("dotenv").config();

const POSTGRESQL_DB = process.env.POSTGRESQL_DB;
const POSTGRESQL_USER = process.env.POSTGRESQL_USER;
const POSTGRESQL_PASSWORD = process.env.POSTGRESQL_PASSWORD;
const POSTGRESQL_HOST = process.env.POSTGRESQL_HOST;

const sequelize = new Sequelize(
  POSTGRESQL_DB,
  POSTGRESQL_USER,
  POSTGRESQL_PASSWORD,
  {
    host: POSTGRESQL_HOST,
    dialect: "postgres",
  },
);

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database");
    return false;
  }
};

module.exports = { sq: sequelize, testDbConnection };
