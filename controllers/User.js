const asyncHandler = require("../middlewares/async");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Create new User
// @route    POST /api/auth/user/register
// @access   public
exports.createUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ where: { email, password } });

  if (user) {
    return next(
      new ErrorResponse("Admin will only registerd at once only", 400)
    );
  }
  user = await User.create(req.body);

  const token = getSignedJwtToken(user);

  res.status(200).json({ success: true, token });
});

// @desc      Login Admin
// @route     POST /api/auth/user/login
// @access    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user

  let user = await User.findOne();
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 404));
  }
  user = await User.findOne({ where: { email: email } });

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //  Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Create token
  const token = getSignedJwtToken(user);

  res.status(200).json({ success: true, token });
});

// @desc      get Current Login
// @route     POST /api/auth/user/me
// @access    Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["email", "name", "id"]
  });
  res.status(200).json(user);
});
