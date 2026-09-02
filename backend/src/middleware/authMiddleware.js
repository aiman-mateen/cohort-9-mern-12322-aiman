const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {


    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.userId;

    next();
  } catch (error) {
     next(error);
  }
};

module.exports = protect;