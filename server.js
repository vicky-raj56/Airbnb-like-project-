import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/expressError.js";

import listingsRouter from "./routes/listings.route.js";
import reviewsRouter from "./routes/reviews.router.js";

dotenv.config();
const app = express();

// connect database to server
connectDB();

// middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// setting up ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Api routes
app.use("/listings", listingsRouter);
app.use("/listings/:id", reviewsRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("listings/error", { message });
  // res.status(statusCode).send(message);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
