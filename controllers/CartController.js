const ErrorHandler = require("../utils/ErrorHandler");
const AsyncHandler = require("../Middleware/AsyncError");
const Cart = require("../models/CartModal");

// creating cart or adding first Item to Cart

exports.createCart = AsyncHandler(async (req, res, next) => {
  const { size, color, quantity } = req.body;
  const productId = req.query.productId;
  const isUserCart = await Cart.find({ userId: req.user._id });

  if (isUserCart.length === 0) {
    const cart = await Cart.create({
      userId: req.user._id,
      CartItems: [{ productId, quantity, size, color }],
    });

    if (!cart) {
      return next(new ErrorHandler("Invalid data ", 400));
    }

    res.status(201).json({
      success: true,
      message: "Cart created",
    });
  } else {
    const isProductInCart = isUserCart[0]?.CartItems?.filter(
      (prod) =>
        prod.productId.toString() === productId.toString() &&
        prod.color === color &&
        prod.size === size
    );

    console.log(isProductInCart);

    if (isProductInCart.length === 1) {
      return next(new ErrorHandler("Product already added in Cart", 403));
    } else {
      await Cart.updateOne(
        { userId: req.user._id },
        {
          $push: {
            CartItems: [{ productId, quantity, size, color }],
          },
        }
      );
    }
    res.status(200).json({
      success: true,
      message: "product is added to Cart ",
    });
  }
});

//updating product quantity in cart

exports.updateQtyCart = AsyncHandler(async (req, res, next) => {
  const { qty } = req.body;
  const variantId = req.params.variantId;

  await Cart.updateOne(
    { "CartItems._id": variantId },
    {
      $set: { "CartItems.$.quantity": qty },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );

  res.status(200).json({
    success: true,
    message: `product quantity increase by ${qty} `,
  });
});

//get All product from Cart
exports.getCart = AsyncHandler(async (req, res, next) => {
  const cart = await Cart.find({ userId: req.user._id }).populate([
    {
      path: "CartItems.productId",
      select: "-variant",
    },
    {
      path: "userId",
      select: ["username"],
    },
  ]);

  if (!cart) {
    return next(new ErrorHandler("oops soory no product in cart  ", 404));
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

//Delete Product From Cart

exports.deleteItemFromCart = AsyncHandler(async (req, res, next) => {
  const variantId = req.params.variantId;

  const isUserCart = await Cart.find({ userId: req.user._id });

  const isProductInCart = isUserCart[0]?.CartItems?.find(
    (prod) => prod._id.toString() === variantId.toString()
  );

  if (!isProductInCart) {
    return next(new ErrorHandler("Product not found ", 404));
  } else {
    await Cart.updateOne(
      { userId: req.user._id },
      {
        $pull: {
          CartItems: { _id: variantId },
        },
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "product remove from  Cart ",
  });
});
