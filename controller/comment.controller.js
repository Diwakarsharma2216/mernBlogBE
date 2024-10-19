const commentModel = require("../model/comment.model");

const createComment = async (req, res) => {
  const { content, userId, postId } = req.body;

  if (req.user._id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not authorized to create a comment" });
  }

  try {
    const comment = await commentModel.create({ content, userId, postId });
    res.status(200).json({ message: "created Succesfully", comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetPostComment = async (req, res) => {
  try {
    const getpostcomments = await commentModel
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 });

    if (!getpostcomments) {
      res.status(400).json({ message: "Comment Not Found" });
    }
    res.status(200).json(getpostcomments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editcomment = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    if (comment.userId != req.user._id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to edit this comment" });
    }
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      { $set: { content: req.body.content } }
    );
    res
      .status(200)
      .json({ message: "Comment Updated Successfully", updatedComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletecomment = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    if (comment.userId != req.user._id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await commentModel.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getcomments = async (req, res) => {
  const startIndex = req.query.startIndex || 0;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  const limit = req.query.limit || 5;

  try {
    const users = await commentModel
      .find()
      .limit(limit)
      .sort({ createdAt: sortDirection })
      .skip(startIndex);
    const totalcomment = await commentModel.countDocuments();
    res.send({ data: users, totalcomment });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    const userIndex = comment.likes.indexOf(req.user._id);

    if (userIndex == -1) {
      comment.likes.push(req.user._id);
      comment.numberOfLikes += 1;
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

   await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  GetPostComment,
  editcomment,
  deletecomment,
  getcomments,
  likeComment,
};
