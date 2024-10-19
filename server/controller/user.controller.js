const UserModel = require("../model/user.model");
const { CreateActivationToken } = require("../utlis/createotp");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const SendOtp = require("../utlis/mail");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const getusers = async (req, res) => {
  const startIndex = req.query.startIndex || 0;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  const limit = req.query.limit || 5;

  try {
    const users = await UserModel.find()
      .limit(limit)
      .sort({ createdAt: sortDirection })
      .skip(startIndex);
    const totalUser = await UserModel.countDocuments();
    res.send({ data: users, totalUser });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
const singup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || !(password.length >= 6)) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const isEmailexist = await UserModel.findOne({ email });
  if (isEmailexist) {
    return res.status(400).json({ message: "Email already exist" });
  }

  const { token, activationCode } = CreateActivationToken({ ...req.body });
  console.log(activationCode);
  const htmltemplate = await ejs.renderFile(
    __dirname + "/../views/sendmail.ejs",
    { otp: activationCode, name }
  );

  try {
     await SendOtp(email, htmltemplate);
    res
      .cookie("verification_Token", token)
      .json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};

const verification = (req, res) => {
  try {
    const token = req?.cookies?.verification_Token;
    console.log(token);
    const { otp } = req.body;
    console.log(otp);

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      } else {
        const { user, activationCode } = decoded;
        if (activationCode == otp) {
          console.log(user, activationCode);
          // bcrypt
          bcrypt.hash(user.password, 5, async function (err, hash) {
            if (err) {
              return res.status(400).json({ message: "Hashing failed" });
            } else {
              await UserModel.create({ ...user, password: hash });
              res.status(200).json({ message: "User Created Succesfully" });
            }
          });
        } else {
          return res.send("verify type wrong otp");
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        // result == false
        console.log(result);
        if (err) {
          return res.status(400).json({ message: "Invalid password" });
        } else {
          if (result) {
            const token = jwt.sign({ user }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res
              .cookie("acces_Token", token)
              .json({ message: "Login successful", user: rest });
          } else {
            return res.status(400).json({ message: "Invalid password" });
          }
        }
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("acces_Token").json({ message: "user logout succsesfully" });
  } catch (error) {
    res.status(400).json({ message: error });
    
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  if (req.user._id != userId) {
    return res
      .status(400)
      .json({ message: "You are not authorized to update this user" });
  }

  if (!req.file) {
    const updateduser = await UserModel.findByIdAndUpdate(req.params.userId, {
      $set: {
        ...req.body,
      },
    });
    res.status(200).json({ message: "User Updated Succesfully" });
  } else {
    const updateduser = await UserModel.findByIdAndUpdate(req.params.userId, {
      $set: {
        ...req.body,
        profilePicture: req.file.filename,
      },
    });
    res.status(200).json({ message: "User Updated Succesfully" });
  }
};

const deleteUser = async (req, res) => {
  if (!req.params.userId) {
    return res.status(400).json({ message: "User not found" });
  }
  await UserModel.findByIdAndDelete(req.params.userId);
  res.status(200).json({ message: "User has been deleted" });
  try {
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  singup,
  verification,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser,
  getusers,
};
