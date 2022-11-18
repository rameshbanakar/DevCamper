const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect,getMe);
router.route("/logout").get(protect, logout);
router.route("/updateDetails").put(protect, updateDetails);
router.route("/updatePassword").put(protect, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);

module.exports=router