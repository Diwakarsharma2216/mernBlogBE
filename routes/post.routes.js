const express = require("express");
const isAuth = require("../middleware/auth");
const RoleValidator = require("../middleware/rolevalidator");
const { Create, deletepost, getposts, updatePost,singlePost } = require("../controller/post.controller");
const upload = require("../utlis/multer");

const postRouter = express.Router();

postRouter.post("/create", isAuth, RoleValidator, Create);
postRouter.get("/:postId", isAuth, RoleValidator, singlePost);
postRouter.delete("/deletepost/:postId/:userId", isAuth, RoleValidator, deletepost);
postRouter.patch("/updatepost/:postId/:userId", isAuth, RoleValidator, upload.single("blogImage"), updatePost);
postRouter.get("/getposts", getposts);

module.exports = postRouter;
