const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

// Protected Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
  } else {
    return next(new ErrorResponse("Not Authorized To Access This Route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not Authorized To Access This Route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `The role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
