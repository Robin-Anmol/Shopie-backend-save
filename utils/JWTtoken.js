const sendToken = (statusCode, user, res) => {
  const usertoken = user.getJWTToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  res.status(statusCode).cookie("sessionToken", usertoken, cookieOptions).json({
    success: true,
    user,
    usertoken,
  });
};

module.exports = sendToken;
