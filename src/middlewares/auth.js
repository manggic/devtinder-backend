const jwt = require("jsonwebtoken");
let SECRET_KEY = "THIS_IS_MY_SECRET_KEY";
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || "";

    if (!token) {
      return res.status(401).json({
        error: true,
        message: `You are not authenticated !!!`,
        success: false,
      });
    }

    const decodedMessage = await jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decodedMessage._id);
    if (!user) {
      throw new Error("Token is not valid");
    }

    req.user = user;
    next();
  } catch (error) {
    res.send("Error - " + error.message);
  }
};

module.exports = { userAuth };
