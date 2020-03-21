const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const sequelize = require("./config/db");
const errorHandler = require("./middlewares/error");

//loading environment variables from .env
dotenv.config({ path: "./config/config.env" });

// route files
const animals = require("./routes/animals");
const users = require("./routes/user");

let app = express();

//bodyParser for raw,text etc
app.use(express.json());

//handeling uploading files
app.use(fileUpload());

//set this folder to static so we can access it from anywhere
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/animals", animals);
app.use("/api/auth/user", users);

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 9000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .underline.bold
  )
);

//databse connection
try {
  sequelize.sync();
  server;
  console.log("DataBase Connected Successfuly".cyan.underline.bold);
} catch (error) {
  console.log(error);
}
