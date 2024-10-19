const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  content:{
    type: String,
    required: true,
  },
  likes:{
    type:Array,
    default:[]
  },
  numberOfLikes:{
    type:Number,
    default:0
  }

},{
  timestamps:true
});

const commentModel=mongoose.model("comment",commentSchema)

module.exports=commentModel