const express = require("express");
const dotenv = require("dotenv");
const connection = require("./db");
const UserRouter = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const postRouter = require("./routes/post.routes");
const commentRouter = require("./routes/comment.routes");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("./uploads"))
app.use(cookieParser());
// view engine
app.set("view engine", "ejs");

app.use(express.json());

app.use("/user", UserRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.listen(8080, async () => {
  try {
    await connection;
    console.log("Server is runinng and conntect to db");
  } catch (error) {
    console.log(error);
  }
});
