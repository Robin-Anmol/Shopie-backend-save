const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const AsyncHandler = require("../Middleware/AsyncError");
const Feature = require("../utils/feature");

//creating a Product --> Admin  Route
exports.createProduct = AsyncHandler(async (req, res, next) => {
  req.body.sellerId = req.user._id;

  const product = new Product(req.body);

  const CreatedProduct = await product.save();
  // console.log(CreatedProduct);
  res.status(201).json({ success: true, CreatedProduct });
});

// get All  Product
exports.getAllProducts = AsyncHandler(async (req, res, next) => {
  const ProductCount = await Product.countDocuments();

  const apiFeature = new Feature(Product, req.query).Search().Filter();
  const allProducts = await apiFeature.query;

  res.status(200).json({ success: true, allProducts, ProductCount });
});

//Upadte product route  --Admin

exports.updateProduct = AsyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorHandler(
        "we cann't find product you are looking for updating ",
        404
      )
    );
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete product admin

exports.deleteProduct = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(
        "we cann't find product you are looking for deletion ",
        404
      )
    );
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product sucessfully deleted ",
  });
});

//Get product Details

exports.getProductDetails = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found ", 404));
  }
  res.status(200).json({ success: true, product });
});

//reviews

// routes for reviews
//first product is valid
//then check whether user have buy the product or not
//if yes then he can create/edit product review
//if already review exits edit /delete product review

exports.createReviews = AsyncHandler(async (req, res, next) => {
  const userReview = {
    userId: req.user._id,
    userName: req.user.username,
    userRating: Number(req.body.rating),
    userComment: req.body.comment,
    ratingImages: req.body.Images,
  };

  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  //then check whether user have buy the product or not
  const isReviewed = product.reviews.find(
    (review) => review.userId.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.userId.toString() === req.user._id.toString()) {
        review.userComment = req.body.comment;
        (review.userRating = req.body.rating),
          (review.ratingImages = req.body.Images);
      }
    });
  } else {
    product.reviews.push(userReview);
    product.totalReviews = product.reviews.length;
  }
  const totalRating = product.reviews.reduce((review1, review2) => {
    return { userRating: review1.userRating + review2.userRating };
  });

  product.averageRating = totalRating.userRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "review created successfully",
    product,
  });
});

// Get All Reviews of a product
exports.getProductReviews = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// / Delete Review
exports.deleteProductReview = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const totalRating = product.reviews.reduce((review1, review2) => {
    return { userRating: review1.userRating + review2.userRating };
  });

  let averageRating = 0;

  if (reviews.length === 0) {
    averageRating = 0;
  } else {
    averageRating = totalRating.userRating / reviews.length;
  }

  const totalReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.params.productId,
    {
      reviews,
      averageRating,
      totalReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "review Successfully deleted",
  });
});
