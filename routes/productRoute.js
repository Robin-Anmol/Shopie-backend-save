const express = require("express");
const router = express.Router();

const ProductControllers = require("../controllers/productController");
const {
  isUserAuthenticated,
  isAdmin,
} = require("../Middleware/Authentication");

router.route("/products").get(ProductControllers.getAllProducts);
router
  .route("/admin/product/new")
  .post(isUserAuthenticated, isAdmin, ProductControllers.createProduct);

router.route("/product/:id").get(ProductControllers.getProductDetails);

//creating product is Admin route
router
  .route("/admin/product/:id")
  .put(isUserAuthenticated, isAdmin, ProductControllers.updateProduct)
  .delete(isUserAuthenticated, isAdmin, ProductControllers.deleteProduct);

router
  .route("/review/:productId")
  .put(isUserAuthenticated, ProductControllers.createReviews)
  .get(ProductControllers.getProductReviews)
  .delete(isUserAuthenticated, ProductControllers.deleteProductReview);

module.exports = router;
