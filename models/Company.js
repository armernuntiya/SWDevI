const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      require: [true, "Please add a address"],
    },
    website: {
      type: String,
      match: [
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        "Please add a valid website",
      ],
    },
    description: {
      type: String,
      require: [true, "Please add a description"],
    },
    tel: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Cascade delete appointments when a hospital is deleted
CompanySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Booking being removed from company ${this._id}`);
    await this.model(`Appointment`).deleteMany({ company: this._id });
    next();
  }
);

//Revers populate with virtuals
CompanySchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "company",
  justOne: false,
});

CompanySchema.virtual("blacklists", {
  ref: "Blacklist",
  localField: "_id",
  foreignField: "company",
  justOne: false,
});

module.exports = mongoose.model("Company", CompanySchema);
