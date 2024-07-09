const mongoose = require("mongoose");

const Validator = require("validator");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

//importing bcryptjs for strong password

///  username
// email
// password
// addresss
// avatar
// phone no

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [50, "Name cannot exceed 50 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [Validator.isEmail, "Please Enter a valid Email"],
    },

    //gender should be added in future

    // phone no should also be tthere

    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
        default: "Default_id",
      },
      avatarUrl: {
        type: String,
        required: true,
        default: "https://avatars.githubusercontent.com/u/90886585",
      },
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippingInfo: [
      //user may have  multile addresses
      {
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
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECERET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

UserSchema.methods.getResetPassword = function () {
  // we need to generate hash token  for resetPasswordToken
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hasing resetpassword token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
