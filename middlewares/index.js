const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

const applyMiddleware = (app) => {
  app.use(
    cors({
      // origin: ["http://localhost:5173", "http://localhost:5174"],
      origin: ["https://www.viptailorstock.com"],
      credentials: true,
      optionSuccessStatus: 200,
    })
  );

  app.use(express.json());
  app.use(cookieParser());
};

module.exports = applyMiddleware;
