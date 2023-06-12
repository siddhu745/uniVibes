const express = require("express");
const cors = require("cors");
const User = require("./models/user");
const Post = require("./models/post");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
require('dotenv').config()


const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = "ajfioopiqurpoijfjj899asddf";

const url = process.env.URL

mongoose.connect(url);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  // res.json(req.cookies);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  const postDoc = await Post.findById(id).populate("author", ["username"]);

  res.json(postDoc);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const UserDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(UserDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const UserDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, UserDoc.password);

  if (passOk) {
    //log in
    jwt.sign({ username, id: UserDoc.id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: UserDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  // const parts = originalname.split(".");
  const pathParts = path.split("\\");
  // console.log(pathParts);
  // const ext = parts[parts.length - 1];

  const newPath = pathParts[0] + "\\" + originalname;

  fs.renameSync(path, newPath);

  const { title, summary, content,option } = req.body;

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      option,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  
  let newPath = ''
  
  if (req.file) {
    const { originalname, path } = req.file;
    // const parts = originalname.split(".");
    const pathParts = path.split("\\");
    // console.log(pathParts);
    // const ext = parts[parts.length - 1];
    newPath = pathParts[0] + "\\" + originalname;

    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const {id,title,summary,content} = req.body

    const postDoc = await Post.findById(id)

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
    if(!isAuthor){
      return res.status(400).json('you are not the author');
    }

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover:newPath ? newPath : postDoc.cover,
    })

    res.json(postDoc);
  });

  
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
