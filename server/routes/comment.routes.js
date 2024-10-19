const express=require("express")
const isAuth = require("../middleware/auth")
const { createComment,GetPostComment, editcomment, deletecomment, getcomments, likeComment } = require("../controller/comment.controller")
const RoleValidator = require("../middleware/rolevalidator")

const commentRouter=express.Router()

commentRouter.post("/create",isAuth,createComment)
commentRouter.get("/getpostcomment/:postId",GetPostComment)
commentRouter.patch("/editcomment/:commentId",isAuth,RoleValidator,editcomment)
commentRouter.delete("/delete/:commentId",isAuth,RoleValidator,deletecomment)
commentRouter.get("/getcomments",isAuth,RoleValidator,getcomments)
commentRouter.patch("/like/:commentId",isAuth,likeComment)





module.exports=commentRouter