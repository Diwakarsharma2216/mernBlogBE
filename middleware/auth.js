const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAuth = (req, res, next) => {
  const { acces_Token } = req?.cookies;

  if (!acces_Token) {
    return res.status(401).json({ msg: "Please login first" });
  }

  jwt.verify(acces_Token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
    // console.log(decoded);
    const { user } = decoded;
    req.user = user;
    next();
  });
};

module.exports = isAuth;
