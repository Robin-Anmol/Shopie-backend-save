const mongoose = require("mongoose");

const OrderItemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity must be atleast 1 "],
    default: 1,
    max: [10, "We ar'e sorry Quantity could't be exceeded 10"],
  },
  size: {
    type: String,
    required: [true, "please Select any  size"],
  },
  color: {
    type: String,
    required: [true, "please select color"],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      phoneNo: {
        type: Number,
        required: true,
      },
    },
    OrderItems: [OrderItemsSchema],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentInfo: {
      paymentId: {
        type: String,
        default: "Null",
        required: true,
      },
      paymentStatus: {
        type: String,
        default: "pending",
        required: true,
      },
      updateTime: {
        type: String,
      },
      email: {
        type: String,
      },
    },

    discountCoupon: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      couponcode: {
        type: String,
      },
      discount: {
        type: Number,
      },
    },

    orderItemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    //set to true after order payment done either it is online or offline cod
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    //set  after order payment done either it is online or offline cod
    paidAt: {
      type: Date,
    },

    orderStatus: {
      type: String,
      required: true,
      default: "ORDER_PLACED",
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
