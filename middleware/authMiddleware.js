const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decode._id).select("-password");
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
});
