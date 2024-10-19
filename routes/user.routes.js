const express = require("express");

const {
  singup,
  verification,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser,
  getusers,
} = require("../controller/user.controller");
const isAuth = require("../middleware/auth");
const upload = require("../utlis/multer");
const RoleValidator = require("../middleware/rolevalidator");
const UserRouter = express.Router();

UserRouter.post("/singup", singup);//done
UserRouter.post("/verification", verification);//done
UserRouter.post("/login", login);//done
UserRouter.get("/getusers",RoleValidator,getusers);
UserRouter.get("/:userId", getUser);//done
UserRouter.get("/logout", logout);
UserRouter.patch(
  "/update/:userId",
  isAuth,
  upload.single("userImage"),
  updateUser
); //done

// Admine Routes Here
UserRouter.delete("/delete/:userId", isAuth, RoleValidator, deleteUser);


module.exports = UserRouter;
