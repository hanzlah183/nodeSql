const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Animal = require("./animal");

const sequelize = require("../config/db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 20],
        msg: "min length of password is 6"
      }
    }
  },
  role: {
    allowNull: true,
    type: DataTypes.STRING(6),
    type: DataTypes.ENUM("admin"),
    defaultValue: "admin"
  }
});

//Define Association
User.hasMany(Animal, { constraints: true, onDelete: "CASCADE" });

//Hased password before save
User.beforeCreate(async user => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Sign JWT and return
getSignedJwtToken = user => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = User;
