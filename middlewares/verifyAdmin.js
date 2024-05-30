const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");

const User = mongoose.model("User", userSchema);

const verifyAdmin = async (req, res, next) => {
  console.log(req.decoded);
  const email = req.decoded.email;
  console.log("verify Admin process", email);
  try {
    const user = await User.findOne({ email }, { role: 1 });
    if (!user) {
      return res.status(404).json({ message: "User not found verify admin" });
    }
    req.isAdmin = user.role === "admin";
    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    res
      .status(500)
      .json({ message: "Error occurred while verifying admin status" });
  }
};

module.exports = verifyAdmin;
