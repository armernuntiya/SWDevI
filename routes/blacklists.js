const express = require("express");
const {
  getBlacklists,
  getBlacklist,
  addBlacklist,
  deleteBlacklist,
} = require("../controllers/blacklists");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, authorize("admin"), getBlacklists)
  .post(protect, authorize("admin"), addBlacklist);

router
  .route("/:id")
  .get(protect, authorize("admin"), getBlacklist)
  .delete(protect, authorize("admin"), deleteBlacklist);

module.exports = router;
