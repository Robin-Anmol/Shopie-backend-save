const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    userRating: { type: Number, required: true },
    userComment: {
      type: String,
      required: [true, "please write review"],
      maxLength: [50, "comment could't be more than "],
    },
    ratingImages: [
      {
        public_id: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true, required: true }
);

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
    },
    colors: [
      {
        color: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  { _id: false }
);

const couponCodeSchema = new mongoose.Schema({
  couponcode: {
    type: String,
  },
  discount: {
    type: Number,
    maxLength: [2, "Discount Cannot be exceed Mrp"],
  },
});

const genderSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: [true, "Please enter the gender"],
    },
  },
  { _id: false }
);

const categoriesSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Please enter the category"],
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    BrandName: {
      //first page
      type: String,
      required: true,
    },

    genders: [genderSchema],
    categories: [categoriesSchema],
    name: {
      //first page
      type: String,
      required: [true, "Enter product name"],
    },
    shortDescription: {
      //first page

      type: String,
      required: [true, "Please Enter product description"],
      maxLength: [400, "Description cannot exceed 400 characters "],
    },

    productDetail: { type: [String], required: true },
    //one more thing we need to add in it which is actual price  on which the
    MrpPrice: {
      //first page
      type: Number,
      required: [true, "Please Enter product price"],
      maxLength: [8, "Price cannot exceed 8 characters "],
    },
    costToProduce: {
      //first page
      type: Number,
      required: [true, "Please Enter product costToProduce"],
      maxLength: [8, "Price cannot exceed 8 characters "],
    },
    mainImage: {
      //first pages
      public_id: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
    },
    //first page
    InStock: {
      type: Number,
      required: [true, "please Enter product Price "],
      max: [10000, "Stock cannot be execeed 10000"],
      min: 0,
      default: 1,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [reviewSchema],
    variant: [sizeSchema],

    sales: {
      type: Boolean,
      required: true,
      default: false,
    },
    saleDiscount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    coupons: [couponCodeSchema],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
