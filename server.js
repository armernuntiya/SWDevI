const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

//Route File
const companies = require(`./routes/companies`);
const auth = require(`./routes/auth`);
const bookings = require(`./routes/bookings`);
const bookmarks = require(`./routes/bookmarks`);
const blacklists = require(`./routes/blacklists`);
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 100,
});

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();

app.use(cors());

//Body parser
app.use(express.json());

//security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

//Cookie parser
app.use(cookieParser());

//Mount Routers
app.use("/api/v1/companies", companies);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/bookmarks", bookmarks);
app.use("/api/v1/blacklists", blacklists);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in", process.env.NODE_ENV, "mode on port", PORT)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
