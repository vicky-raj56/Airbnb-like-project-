import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { validateListing } from "../utils/validation.js";
import isLogedIn, { isOwner } from "../middlewares/isLogedIn.js";
// import multer from "multer";
import upload from "../middlewares/multer.js";

import {
  createNewListing,
  deleteListing,
  editListingForm,
  newListingForm,
  showAllListings,
  showListingDetails,
  updateListing,
} from "../controllers/listings.ctrl.js";

const router = express.Router();

// index route to show all listings
router.get("/", showAllListings);

// new listing form route
router.get("/new", isLogedIn, newListingForm);

// show route to show single listing details
router.get("/:id", showListingDetails);

// create route to add new
// const upload = multer({ dest: 'uploads/' })
router.post(
  "/",
  isLogedIn,
  validateListing,
  upload.single("image"),
  wrapAsync(createNewListing)
);

// edit show  routes one by one

router.get("/:id/edit", isLogedIn, isOwner, editListingForm);
// update route
router.put("/:id", isLogedIn, isOwner, validateListing, upload.single("image"), updateListing);

// delete route
router.delete("/:id", isLogedIn, isOwner, deleteListing);

export default router;
