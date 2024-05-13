const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(401).send({ message: "Unauthorized access" });
  }
};

module.exports = {
  verifyToken,
};
