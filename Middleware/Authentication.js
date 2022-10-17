const AsyncHandler = require("./AsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/UserModel");

exports.isUserAuthenticated = AsyncHandler(async (req, res, next) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    return next(new ErrorHandler("User is unauthorized", 401));
  }

  const decodedData = jwt.verify(sessionToken, process.env.JWT_SECERET_KEY);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(
      new ErrorHandler(
        `Role: ${
          !req.user.isAdmin ? "User" : ""
        } is not allowed to access this resouce `,
        403
      )
    );
  }
  next();
};
