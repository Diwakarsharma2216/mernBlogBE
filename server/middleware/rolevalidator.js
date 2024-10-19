const { models } = require("mongoose");

const RoleValidator = (req, res, next) => {
   
  const { isAdmin } = req.user;
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
   next()
};


module.exports = RoleValidator;