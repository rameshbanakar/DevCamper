const errorResponse = require("../utils/errorResponse");
const User = require("../models/user");
const asyncHandler = require("../middleware/async");

//@desc register user
//@route POST /api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);
});

//@desc login user
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new errorResponse(`Enter the valid user name and password`, 400)
    );
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new errorResponse(`Invalid credentials`, 401));
  }
  //password matching
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new errorResponse(`wrong username or password`, 401));
  }

  sendTokenResponse(user, 200, res);
});

//get token from model and create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const option = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if(process.env.NODE_ENV==="production"){
    option.secure=true;
  }
  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    token,
  });
};
