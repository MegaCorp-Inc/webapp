require("dotenv").config()
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRESQL_DB_URI,{dialect: "postgres"});

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


module.exports = {sq: sequelize, testDbConnection}