const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
require("colors");
const applyMiddleware = require("./middlewares");
// middleware
// app.use(cors());
app.use(express.json());

applyMiddleware(app);

const dburi = `mongodb+srv://${process.env.SUPERSHOP_USERNAME}:${process.env.SUPERSHOP_PASSWORD}@cluster0.lmwybt8.mongodb.net/?retryWrites=true&w=majority`;

const databaseConnect = async () => {
  try {
    await mongoose.connect(dburi);

    // app.post("/jwt", (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "72h",
    //   });
    //   res.send({ token });
    // });

    console.log("Database connection successful".cyan.underline);
  } catch (error) {
    console.log(error.message);
    console.log("Database connection failed");
  }
};
databaseConnect();

// Routes function
const sellSchema = require("./routeHandler/sellProductHandler");
const orderHandler = require("./routeHandler/orderProductHandler");
const userHandler = require("./routeHandler/userHandler");
const noteHandler = require("./routeHandler/noteBookHandler");
const categoryHandler = require("./routeHandler/categoryHandler");
const cartsHandler = require("./routeHandler/cartsHandler");
const soldHandler = require("./routeHandler/soldHandler");
const authHandler = require("./routeHandler/authHandler");

app.get("/", (req, res) => {
  res.send("SuperShop. Unlock your code knowledge");
});

// application routes
app.use("/sellProduct", sellSchema);
app.use("/orderProduct", orderHandler);
app.use("/user", userHandler);
app.use("/noteBooks", noteHandler);
app.use("/category", categoryHandler);
app.use("/carts", cartsHandler);
app.use("/soldItems", soldHandler);
app.use("/auth", authHandler);

app.get("/", (req, res) => {
  res.send("SuperShop. Unlock your code knowledge");
});

app.listen(port, (req, res) => {
  console.log(`SuperShop are running on: ${port}`.blue.bold);
});
