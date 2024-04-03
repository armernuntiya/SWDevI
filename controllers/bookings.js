const Booking = require("../models/Booking");
const Company = require("../models/Company");
const Blacklist = require("../models/Blacklist");
const Bookmark = require("../models/Bookmark");
const { exists } = require("../models/User");

//@desc     Get All Bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req, res, next) => {
  let query;
  // General users can see only their bookings!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "company",
      select: "name description tel",
    });
  } else {
    //If you are an admin, you can see all?

    if (req.params.companyID) {
      console.log(req.params.companyID);
      query = Booking.find({ company: req.params.companyID }).populate({
        path: "company",
        select: "name description tel",
      });
    } else
      query = Booking.find().populate({
        path: "company",
        select: "name description tel",
      });
  }
  try {
    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Booking",
    });
  }
};

//@desc     Get single Booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "company",
      select: "name description tel",
    });

    if (!booking) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Booking",
    });
  }
};

//@desc     Add Booking
//@route    POST /api/v1/companies/:companyID/booking
//@access   Public
exports.addBooking = async (req, res, next) => {
  try {
    req.body.company = req.params.companyID;

    const company = await Company.findById(req.params.companyID);

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `No company with the id of ${req.params.companyID}`,
      });
    }

    // add user Id to req.body
    req.body.user = req.user.id;

    const existedBlacklist = await Blacklist.find({
      company: req.params.companyID,
      user: req.user.id,
    });

    // Check for existed booking
    const existedBookings = await Booking.find({ user: req.user.id });

    if (existedBlacklist.length >= 1) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} is blacklisted by company`,
      });
    }

    //If the user is not an admin, they can only create booking.
    if (existedBookings.length >= 3) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }
    await Bookmark.findOneAndDelete({
      company: req.body.company,
      user: req.body.user,
    });

    const booking = await Booking.create(req.body);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Booking",
    });
  }
};

//@desc     Update Booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
