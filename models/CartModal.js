const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    CartItems: [
      {
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
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
