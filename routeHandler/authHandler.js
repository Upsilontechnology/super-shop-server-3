const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
router.post("/jwt", async (req, res, next) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "72h",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 72 * 60 * 60 * 1000,
      })
      .send({ success: true });
  } catch (error) {
    console.error("Error generating auth cookie:", error);
    next(error);
  }
});

router.get("/logout", async (req, res) => {
  const user = req.body;
  console.log("logging out", user);
  res.clearCookie("token", { maxAge: 0 }).send({ success: true });
});

module.exports = router;
