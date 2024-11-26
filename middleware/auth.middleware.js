const jwt = require("jsonwebtoken");

const UserModel = require("../user.model/user.model")
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.secreteKey, async(err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Invalid or expired token" });
      }
      const user = await UserModel.findById(decoded.id)
      req.user = user;

      next();
    });
  } catch (error) {
    res
      .status(500)
      .send({ messasge: "Internal server error", error: error.messasge });
  }
};

module.exports = authMiddleware;
