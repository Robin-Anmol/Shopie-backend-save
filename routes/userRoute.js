const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const {
  isUserAuthenticated,
  isAdmin,
} = require("../Middleware/Authentication");

router.route("/register").post(userController.SignUp);
router.route("/login").post(userController.loginUser);
router.route("/password/forgot").post(userController.forgotPassword);
router.route("/password/reset/:resetToken").put(userController.resetPassword);
router.route("/logout").get(userController.logoutUser);

router
  .route("/profile")
  .get(isUserAuthenticated, userController.getUserDetails);

router
  .route("/profile/edit")
  .put(isUserAuthenticated, userController.updateProfile);

//admin routes

router
  .route("/admin/users")
  .get(isUserAuthenticated, isAdmin, userController.getAllUsers);

router
  .route("/admin/user/:id")
  .get(isUserAuthenticated, isAdmin, userController.getUserByAdmin)
  .put(isUserAuthenticated, isAdmin, userController.updateUserByAdmin)
  .delete(isUserAuthenticated, isAdmin, userController.deleteUserByAdmin);

module.exports = router;
