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
  const token = user.getSignedJwtToken();
  res.status(200).json({sucess:true,token})
});

//@desc login user
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password} = req.body;
  if(!email ||!password){
     return next(new errorResponse(`Enter the valid user name and password`, 400));
  }

  const user=await User.findOne({email:email}).select("+password");

  if(!user){
    return next(
      new errorResponse(`Invalid credentials`, 401)
    );
  }
  //password matching
  const isMatch = await user.matchPassword(password);
  if(!isMatch){
     return next(new errorResponse(`wrong username or password`, 401));
  }
  
  const token = user.getSignedJwtToken();
  res.status(200).json({sucess:true,token})
});
