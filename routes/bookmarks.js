const express = require("express");
const {
  getBookmarks,
  getBookmark,
  addBookmark,
  deleteBookmark,
} = require("../controllers/bookmarks");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, authorize("admin", "user"), getBookmarks)
  .post(protect, authorize("admin", "user"), addBookmark);

router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getBookmark)
  .delete(protect, authorize("admin", "user"), deleteBookmark);

module.exports = router;
