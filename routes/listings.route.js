import express from "express";
import listingModel from "../models/listing.model.js";
import wrapAsync from "../utils/wrapAsync.js";
// import reviewModel from "./models/review.model.js";

const router = express.Router();

// Root route (Home page)
router.get("/", (req, res) => {
  res.redirect("/listings");
});

// index route to show all listings
router.get("/", async (req, res) => {
  try {
    const allListings = await listingModel.find({});
    // console.log(allListings)
    res.render("listings/index", { allListings });
    // console.log(allListings)
  } catch (error) {
    console.log("Error :", error.message);
    res.status(500).send("Server Error");
  }
});

// new listing form route
router.get("/new", (req, res) => {
  try {
    res.render("listings/new.ejs");
  } catch (error) {
    res.status(500).send("Server Error", error.message);
  }
});

// show route to show single listing details
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await listingModel.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// create route to add new
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    // we use wrapAsync that's why i can't use try and catch
    const { title, description, image, price, location, country } = req.body;
    const newListing = new listingModel({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    await newListing.save();
    res.redirect("/listings");
  }),
);

// edit show  routes one by one

router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const userListing = await listingModel.findById(id);
    res.render("listings/edit.ejs", { userListing });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
// update route
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, image, price, location, country } = req.body;
    await listingModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        price,
        location,
        country,
      },
      { new: true },
    );
    res.redirect(`/listings/${id}`);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// delete route
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await listingModel.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

export default router;
