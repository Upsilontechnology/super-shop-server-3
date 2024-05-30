const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    // console.log("Client token:", token);
    console.log("verifyToken Attcak done");
    if (!token) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);
    req.decoded = decoded;
    next();
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired" });
    }
    return res.status(401).send({ message: "Unauthorized access" });
  }
};

module.exports = verifyToken;
