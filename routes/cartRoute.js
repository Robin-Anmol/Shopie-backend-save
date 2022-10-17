const express = require("express");
const router = express.Router();

const CartController = require("../controllers/CartController");
const { isUserAuthenticated } = require("../Middleware/Authentication");

router
  .route("/cart")
  .put(isUserAuthenticated, CartController.createCart)
  .get(isUserAuthenticated, CartController.getCart);
router
  .route("/cart/:variantId")
  .put(isUserAuthenticated, CartController.updateQtyCart)
  .delete(isUserAuthenticated, CartController.deleteItemFromCart);

module.exports = router;
