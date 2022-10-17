const express = require("express");
const app = express();
const errorMiddleware = require("./Middleware/error");
// all Routes
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

const wishlist = require("./routes/wishListRoute");
const cart = require("./routes/cartRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", wishlist);
app.use("/api/v1", cart);
app.use("/api/v1", order);

//Middleware for error
app.use(errorMiddleware);
module.exports = app;
