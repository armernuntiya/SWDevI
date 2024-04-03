const Bookmark = require("../models/Bookmark");
const Company = require("../models/Company");

//@desc     Get All Bookmarks
//@route    GET /api/v1/bookmarks
//@access   Public
exports.getBookmarks = async (req, res, next) => {
  let query;
  // General users can see only their bookmarks!
  if (req.user.role !== "admin") {
    query = Bookmark.find({ user: req.user.id }).populate({
      path: "company",
      select: "name description tel",
    });
  } else {
    //If you are an admin, you can see all?

    query = Bookmark.find().populate({
      path: "company",
      select: "name description tel",
    });
  }
  try {
    const bookmarks = await query;

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Bookmark",
    });
  }
};

//@desc     Get single Bookmark
//@route    GET /api/v1/bookmarks/:id
//@access   Public
exports.getBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id).populate({
      path: "company",
      select: "name description tel",
    });

    if (!bookmark) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Bookmark",
    });
  }
};

//@desc     Add Bookmark
//@route    POST /api/v1/bookmarks
//@access   Public
exports.addBookmark = async (req, res, next) => {
  try {
    const company = await Company.findById(req.body.company);

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `No company with the id of ${req.body.company}`,
      });
    }

    // add user Id to req.body
    req.body.user = req.user.id;

    const bookmark = await Bookmark.create(req.body);

    res.status(200).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Bookmark",
    });
  }
};

//@desc     Update Bookmark
//@route    PUT /api/v1/bookmarks/:id
//@access   Private
exports.updateBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(400).json({
        success: false,
        message: `No bookmark with the id of ${req.params.id}`,
      });
    }

    if (bookmark.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this bookmark`,
      });
    }

    bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: bookmark });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Cannot update Bookmark" });
  }
};

//@desc     Delete bookmark
//@route    DELETE /api/v1/bookmarks/:id
//@access   Private
exports.deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(400).json({
        success: false,
        message: `No bookmark with the id of ${req.params.id}`,
      });
    }

    if (bookmark.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this bookmark`,
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
