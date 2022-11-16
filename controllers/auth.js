const errorResponse = require("../utils/errorResponse");
const User = require("../models/user");
const asyncHandler = require("../middleware/async");

//@desc register user
//@route /api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  const token = user.getSignedJwtToken();
  res.status(200).json({sucess:true,token})
});
