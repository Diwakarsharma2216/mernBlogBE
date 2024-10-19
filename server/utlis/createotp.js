// Function to create activation token with JWT
const dotenv = require("dotenv");
dotenv.config();
const jwt=require("jsonwebtoken")
const CreateActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(activationCode);
    const token = jwt.sign(
      { user, activationCode },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    return { token, activationCode };
  };

  module.exports={CreateActivationToken}