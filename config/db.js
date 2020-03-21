const Sequelize = require("sequelize");

const sequelize = new Sequelize("DATA_BASE", "root", "mysql1", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
