const PostModel = require("../model/post.model");

const Create = async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).send({ message: "Please fill in all fields." });
  }

  try {
    const newPost = await PostModel.create({
      ...req.body,
      userId: req.user._id,
    });
    res
      .status(201)
      .send({ message: "Post created Successfully", data: newPost });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const deletepost = async (req, res) => {
  if (req.user._id !== req.params.userId) {
    return res
      .status(403)
      .send({ message: "You are not authorized to delete this post." });
  }

  try {
    await PostModel.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const getposts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await PostModel.find({
      $or: [
        { title: { $regex: req.query.q || "", $options: "i" } },
        { content: { $regex: req.query.q || "", $options: "i" } },
      ],
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await PostModel.countDocuments();

    res.status(200).json({
      posts,
      totalPosts,
      message: "post get succesfully",
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  if (req.user._id !== req.params.userId) {
    return res
      .status(403)
      .send({ message: "You are not authorized to delete this post." });
  }

  try {
    if (req.file) {
      const updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, {
        $set: {
          ...req.body,
          image: req.file.filename,
        },
      });
      res.status(200).json(updatedPost);
    } else {
      const updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, {
        $set: {
          ...req.body,
        },
      });
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const singlePost = async (req, res) => {
  try {
    const posts = await PostModel.findById(req.params.postId);
console.log(posts)
    if (!posts) {
      return res.status(400).json({message:"Post not found"})
    }
    res.status(200).json({
      posts,
   
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
module.exports = { Create, deletepost, getposts, updatePost,singlePost };
