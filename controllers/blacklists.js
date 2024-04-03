const Blacklist = require("../models/Blacklist");
const Company = require("../models/Company");
const Booking = require("../models/Booking");

//@desc     Get All Blacklists
//@route    GET /api/v1/blacklists
//@access   Private
exports.getBlacklists = async (req, res, next) => {
  let query;
  if (req.params.companyID) {
    console.log(req.params.companyID);
    query = Blacklist.find(req.params.companyID).populate([
      {
        path: "company",
        select: "name description tel",
      },
      {
        path: "user",
        select: "name email tel",
      },
    ]);
  } else {
    query = Blacklist.find().populate([
      {
        path: "company",
        select: "name description tel",
      },
      {
        path: "user",
        select: "name email tel",
      },
    ]);
  }
  try {
    const blacklists = await query;

    res.status(200).json({
      success: true,
      count: blacklists.length,
      data: blacklists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Blacklist",
    });
  }
};

//@desc     Get single Blacklist
//@route    GET /api/v1/blacklists/:id
//@access   Public
exports.getBlacklist = async (req, res, next) => {
  try {
    const blacklist = await Blacklist.findById(req.params.id).populate([
      {
        path: "company",
        select: "name description tel",
      },
      {
        path: "user",
        select: "name email tel",
      },
    ]);

    if (!blacklist) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: blacklist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Blacklist",
    });
  }
};

//@desc     Add Blacklist
//@route    POST /api/v1/companies/:companyID/blacklists
//@access   Public
exports.addBlacklist = async (req, res, next) => {
  try {
    req.body.company = req.params.companyID;

    const company = await Company.findById(req.params.companyID);

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `No company with the id of ${req.params.companyID}`,
      });
    }

    await Booking.findOneAndDelete(req.body);

    const blacklist = await Blacklist.create(req.body);

    res.status(200).json({
      success: true,
      data: blacklist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Blacklist",
    });
  }
};

//@desc     Delete blacklist
//@route    DELETE /api/v1/blacklists/:id
//@access   Private
exports.deleteBlacklist = async (req, res, next) => {
  try {
    const blacklist = await Blacklist.findById(req.params.id);

    if (!blacklist) {
      return res.status(400).json({
        success: false,
        message: `No blacklist with the id of ${req.params.id}`,
      });
    }

    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this blacklist`,
      });
    }

    await blacklist.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
