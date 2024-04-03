const mongoose = require("mongoose");
const Company = require("./Company");

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);
