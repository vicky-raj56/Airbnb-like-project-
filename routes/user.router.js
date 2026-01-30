import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { validateUser } from "../utils/validation.js";
import { saveRedirectUrl } from "../middlewares/isLogedIn.js";
import { createUser } from "../controllers/user.ctrl.js";

const router = express.Router();

// show signup route page
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// post route for signup
router.post("/signup", validateUser, wrapAsync(createUser));

// login route
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// post route for login
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings"); // login ke baad waha redirect kr de jaha se aya tha
  },
);

// logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
});

export default router;
