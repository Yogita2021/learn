const mongoose = require("mongoose");

const connection = mongoose.connect(`${process.env.mongodbURL}`);

module.exports = { connection };
