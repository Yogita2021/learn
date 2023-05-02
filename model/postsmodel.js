const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: { require: true, type: String },
    body: { require: true, type: String },
    no_of_comments: { require: true, type: Number },
    device: {
      require: true,
      type: String,
      enum: ["Laptop", "Tablet", "Mobile"],
    },
    authorID: String,
  },
  {
    versionKey: false,
  }
);

const PostModel = mongoose.model("post", postSchema);
module.exports = { PostModel };
