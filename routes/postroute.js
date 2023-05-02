const express = require("express");
const jwt = require("jsonwebtoken");
const postRoute = express.Router();
const { PostModel } = require("../model/postsmodel");

postRoute.use(express.json());

postRoute.post("/add", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ msg: "err" });
  }
});

postRoute.get("/", async (req, res) => {
  try {
    const { device, min_comments, max_comments, page } = req.query;
    let skip;
    if (page) {
      skip = (page - 1) * 3;
    } else {
      skip = 0;
    }
    let query = { authorID: req.body.authorID };
    if (device) {
      query.device = device;
    }
    if (min_comments) {
      query.no_of_comments = { $gte: min_comments };
    }
    if (max_comments) {
      if (!query.no_of_comments) {
        query.no_of_comments = { $lte: max_comments };
      } else {
        query.no_of_comments.$lte = max_comments;
      }
    }

    const postdata = await PostModel.find(query).skip(skip).limit(3);
    res.status(200).json(postdata);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
postRoute.get("/top", async (req, res) => {
  try {
    const { page } = req.query;
    let skip;
    if (page) {
      skip = (page - 1) * 3;
    } else {
      skip = 0;
    }

    const query = { author: req.body.authorID };

    const postdata = await PostModel.find(query)
      .sort({ no_of_comments: -1 })
      .skip(skip)
      .limit(3);
    res.status(200).json(postdata);
  } catch (error) {
    res.status(400).json({ message: "Top-error" });
  }
});

postRoute.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id });
    if (req.body.authorID !== post.authorID) {
      res.status(200).send({ msg: "you are not authorized for this action" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, req.body);
      res.status(200).send({ msg: "Data Has been Updated" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});
postRoute.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id });
    if (req.body.authorID !== post.authorID) {
      res.status(200).send({ msg: "you are not authorized for this action" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: "Data Has been deleted" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = {
  postRoute,
};
