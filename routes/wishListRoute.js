const express = require("express");
const router = express.Router();
const WishListController = require("../controllers/wishlistController");
const { isUserAuthenticated } = require("../Middleware/Authentication");

router
  .route("/wishlist")
  .get(isUserAuthenticated, WishListController.getwishlist)
  .put(isUserAuthenticated, WishListController.createWishList)
  .delete(isUserAuthenticated, WishListController.deleteItemFromWish);

module.exports = router;
