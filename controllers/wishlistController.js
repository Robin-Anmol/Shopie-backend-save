const WishList = require("../models/WishlistModal");
const ErrorHandler = require("../utils/ErrorHandler");
const AsyncHandler = require("../Middleware/AsyncError");

exports.createWishList = AsyncHandler(async (req, res, next) => {
  const productId = req.query.productId;

  const isUserWishlist = await WishList.find({ userId: req.user._id });

  if (isUserWishlist.length === 0) {
    const wishlist = await WishList.create({
      userId: req.user._id,
      wishlistItems: [{ productId: productId }],
    });

    if (!wishlist) {
      return next(new ErrorHandler("Invalid data ", 400));
    }

    res.status(201).json({
      success: true,
      message: "wishlist created",
    });
  } else {
    const isProductInWishlist = isUserWishlist[0]?.wishlistItems?.find(
      (prod) => prod.productId.toString() === productId.toString()
    );

    if (isProductInWishlist) {
      return next(new ErrorHandler("Product already added in wishlist", 403));
    } else {
      await WishList.updateOne(
        { userId: req.user._id },
        {
          $push: {
            wishlistItems: [{ productId: productId }],
          },
        }
      );
    }
    res.status(200).json({
      success: true,
      message: "product is added to wishlist ",
    });
  }
});

//get user wishlist

exports.getwishlist = AsyncHandler(async (req, res, next) => {
  const wishlist = await WishList.find({ userId: req.user._id }).populate(
    "wishlistItems.productId"
  );

  if (!wishlist) {
    return next(new ErrorHandler("oops soory no product in wishlist  ", 404));
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});

//userId is same in all product which is in wishlist of user

//delete item from wishlist
exports.deleteItemFromWish = AsyncHandler(async (req, res, next) => {
  const productId = req.query.productId;

  const isUserWishlist = await WishList.find({ userId: req.user._id });

  const isProductInWishlist = isUserWishlist[0]?.wishlistItems?.find(
    (prod) => prod.productId.toString() === productId.toString()
  );

  if (!isProductInWishlist) {
    return next(new ErrorHandler("Product not found ", 404));
  } else {
    await WishList.updateOne(
      { userId: req.user._id },
      {
        $pull: {
          wishlistItems: { productId: productId },
        },
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "product remove from  wishlist ",
  });
});
