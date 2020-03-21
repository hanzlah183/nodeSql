const express = require("express");

const {
  createUser,
  loginUser,
  getCurrentUser
} = require("../controllers/User");

const {protect} = require('../middlewares/auth')

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me",protect, getCurrentUser);

module.exports = router;
