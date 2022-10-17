const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/orderController");
const {
  isUserAuthenticated,
  isAdmin,
} = require("../Middleware/Authentication");
router
  .route("/order/myorders")
  .get(isUserAuthenticated, OrderController.getMyOrders);

router
  .route("/order/allorders")
  .get(isUserAuthenticated, isAdmin, OrderController.getAllOrders);

router
  .route("/order/new")
  .post(isUserAuthenticated, OrderController.createNewOrder);
router
  .route("/order/:orderId")
  .get(isUserAuthenticated, OrderController.getSingleOrder)
  .delete(isUserAuthenticated, isAdmin, OrderController.deleteOrder);
router
  .route("/order/:orderId/pay")
  .put(isUserAuthenticated, OrderController.updateOrderToPaid);
router
  .route("/order/:orderId/deliver")
  .put(isUserAuthenticated, isAdmin, OrderController.upadtedOrderStatus);

module.exports = router;
