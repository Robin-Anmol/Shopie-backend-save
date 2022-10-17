const Order = require("../models/OrderModal");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const AsyncHandler = require("../Middleware/AsyncError");
const Cart = require("../models/CartModal");

exports.createNewOrder = AsyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    OrderItems,
    paymentMethod,
    orderItemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discountCoupon,
  } = req.body;

  if (OrderItems?.length === 0) {
    return next(new ErrorHandler(`OrderItems cann't be empty `, 400));
  }

  const newOrder = new Order({
    shippingInfo,
    OrderItems,
    paymentMethod,
    orderItemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discountCoupon,
    userId: req.user._id,
  });

  const yourOrder = await newOrder.save();

  if (yourOrder) {
    await Cart.updateOne(
      { userId: req.user._id },
      {
        $pull: {
          CartItems: {},
        },
      }
    );
  }

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
    yourOrder,
  });
});

//update order to paid

exports.updateOrderToPaid = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentInfo = {
    paymentId: req.body.paymentId,
    paymentStatus: req.body.paymentStatus,
    updateTime: req.body.updateTime,
    email: req.body.email,
  };
  const updatedOrder = await order.save();
  res.status(200).json({
    success: true,
    message: "Payment Done Successfully",
    updatedOrder,
  });
});

//get Single Order

exports.getSingleOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate([
    {
      path: "OrderItems.productId",
      select: "-variant",
    },
    {
      path: "userId",
      select: ["username", "email"],
    },
  ]);

  if (!order) {
    return next(
      new ErrorHandler(
        `Order not found with this id:${req.params.orderId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//get user all orders
exports.getMyOrders = AsyncHandler(async (req, res, next) => {
  const myOrders = await Order.find({ userId: req.user._id }).populate([
    {
      path: "OrderItems.productId",
      select: "-variant",
    },
    {
      path: "userId",
      select: ["username", "email"],
    },
  ]);

  if (!myOrders) {
    return next(new ErrorHandler("You have not ordered anything yet ", 404));
  }

  res.status(200).json({
    success: true,
    myOrders,
  });
});

//get All orders --Admin route

exports.getAllOrders = AsyncHandler(async (req, res, next) => {
  const AllOrders = await Order.find({}).populate([
    {
      path: "OrderItems.productId",
      select: "-variant",
    },
    {
      path: "userId",
      select: ["username", "email"],
    },
  ]);

  let TotalOrderPrice = 0;
  if (!AllOrders) {
    return next(new ErrorHandler("Something went wrong", 500));
  }

  AllOrders?.forEach((order) => {
    TotalOrderPrice += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    AllOrders,
    TotalOrderPrice,
  });
});

//upadte order after deliver //admin route
async function updateStock(order) {
  console.log(order);

  const { productId, size, color, quantity } = order;
  const product = await Product.findById(productId);

  product.InStock -= quantity;

  await Product.updateOne(
    {
      _id: productId,
    },
    {
      $inc: { "variant.$[t].colors.$[robin].stock": -quantity },
    },
    { arrayFilters: [{ "t.size": size }, { "robin.color": color }] }
  );

  await product.save({ validateBeforeSave: false });
}

exports.upadtedOrderStatus = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorHandler(
        `Order not found with this id:${req.params.orderId}`,
        404
      )
    );
  }

  if (order.orderStatus === "DELIVERED") {
    return next(new ErrorHandler("Order is already Delivered ", 400));
  }
  if (req.body.orderStatus === "SHIPPED") {
    order.OrderItems.forEach(async (order) => {
      await updateStock(order);
    });
  }

  order.orderStatus = req.body.orderStatus;

  if (order.orderStatus === "DELIVERED") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: order.orderStatus,
  });
});

//delete order admin

//may be in future it would be deleted
exports.deleteOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      new ErrorHandler(
        `Order not found with this id:${req.params.orderId}`,
        404
      )
    );
  }
  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order successfully deleted",
  });
});
