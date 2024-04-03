const mongoose = require("mongoose");
const Company = require("./Company");

const BookingSchema = new mongoose.Schema({
  bookDate: {
    type: Date,
    require: true,
    min: "2022-05-10",
    max: "2022-05-14",
  },
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

module.exports = mongoose.model("Booking", BookingSchema);
