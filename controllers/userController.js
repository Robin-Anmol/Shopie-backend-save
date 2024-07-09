const ErrorHandler = require("../utils/ErrorHandler");
const AsyncHandler = require("../Middleware/AsyncError");
const User = require("../models/UserModel");
const sendToken = require("../utils/JWTtoken");
const SendEmail = require("../utils/SendEmail");

const crypto = require("crypto");

exports.SignUp = AsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const newUser = await User.create({
    username,
    email,
    password,
  });

  if (!newUser) {
    return next(new ErrorHandler("please Enter valid data ", 400));
  }

  sendToken(201, newUser, res);
});

//Login user

exports.loginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found ", 401));
  }

  const isPasswordMatched = await user?.comparePassword(password); //check user is true if user is true then comparred password
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email & password", 401));
  }
  sendToken(200, user, res);
});

//logout User

exports.logoutUser = AsyncHandler(async (req, res, next) => {
  res.cookie("sessionToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User Sucessfully Logout",
  });
});

exports.forgotPassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found ", 404));
  }

  //generating reset token
  const resetToken = user.getResetPassword();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const resetPasswordMessage = `Hello ${user.username},

  Somebody requested a new password for the Shopie account associated with ${user.email}.
  
  No changes have been made to your account yet.
  
  You can reset your password by clicking the link  below:

  ${resetPasswordUrl}
  
  If you did not requested this email then, please ignore it.
  
  Yours,
  The Shopie team`;

  try {
    await SendEmail({
      email: user.email,
      subject: "Shopie Reset Password ",
      resetPasswordMessage,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully !`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password

exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const resetPasswordToken = (this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex"));
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Confirm Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(200, user, res);
});

//getUserDetails

exports.getUserDetails = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({ success: true, user });
});

//update user Profile

exports.updateProfile = AsyncHandler(async (req, res, next) => {
  const newUserData = {
    username: req.body.username,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

//User Admin mehods

exports.getAllUsers = AsyncHandler(async (req, res, next) => {
  const AllUsers = await User.find();

  if (!AllUsers) {
    return next(new ErrorHandler("something went worng", 404));
  }

  res.status(200).json({
    success: true,
    AllUsers,
  });
});

//get User Details by admin

exports.getUserByAdmin = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id :${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, user });
});

//update user by admin
exports.updateUserByAdmin = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id :${req.params.id}`, 404)
    );
  }

  const newUserData = {
    isAdmin: req.body.isAdmin,
  };

  await user.update(newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    message: "User Role Successfully changed ",
  });
});

//delete user by admin

exports.deleteUserByAdmin = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id :${req.params.id}`, 404)
    );
  }

  await user.remove();
  // delete user data

  res.status(201).json({
    success: true,
    message: "User Successfully deleted ",
  });
});
