import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
// import ExpressError from "./utils/expressError.js";
import session from "express-session";
import mongoStore from "connect-mongo";
import flash from "connect-flash";
import listingsRouter from "./routes/listings.route.js";
import reviewsRouter from "./routes/reviews.router.js";
import passport from "passport";
import passportLocal from "passport-local";
import userModel from "./models/user.model.js";
import userRouter from "./routes/user.router.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();


// connect database to server
connectDB();

// connect cloud to databae
connectCloudinary();

// middleware to parse JSON request bodies
app.use(cors());
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

const store = mongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto:{
    secret:process.env.SESSION_SECRET
  },
  touchAfter:24*60*60 // time period in seconds
});

store.on("error",function(e){
  console.log("Session Store Error",e);
});

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7dayds
    httpOnly: true,
  },
};

// Root route (Home page)
app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());
// Passport.js configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// login route for check passport
// app.get("/demouser", async (req, res) => {
//   try {
//     const fakeUser = new userModel({
//       email: "vicky@gmail.com",
//       username: "vicky",
//     });
//     const registerd = await userModel.register(fakeUser, "vicky1234");
//     console.log(registerd);
//     res.send(registerd);
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).send("Error registering user");
//   }
// });

// Api routes
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id", reviewsRouter); // yaha pe hme id bhi likh diya ab ye id direct iske route me nhi jayga isske liye ab iske route me Router({mergeParams:true}), ye merge params likhna hoga

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
