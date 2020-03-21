const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Animal = sequelize.define("name", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "no-img.jpg"
  }
});



module.exports = Animal;
