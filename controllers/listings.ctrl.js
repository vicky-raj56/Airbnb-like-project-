import dotenv from "dotenv";
dotenv.config();

import listingModel from "../models/listing.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import mbxClient from '@mapbox/mapbox-sdk'
import mbxGeocding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapToken = process.env.MAPBOX_TOKEN;

const geoCodingClient = mbxGeocding({ accessToken: mapToken });

// index route to show all listings
const showAllListings = async (req, res) => {
  try {
    const allListings = await listingModel.find({});
    // console.log(allListings
    res.render("listings/index", { allListings });
    // console.log(allListings)
  } catch (error) {
    console.log("Error :", error.message);
    res.status(500).send("Server Error");
  }
};

// new listing form route
const newListingForm = (req, res) => {
  try {
    res.render("listings/new.ejs");
  } catch (error) {
    res.status(500).send("Server Error", error.message);
  }
};

// show route to show single listing details
const showListingDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await listingModel
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", " Listing Not Found!");

      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.log("showRoute ", { error: error.message });
    res.status(500).send({ success: false, message: "Server Error" });
  }
};

// create route to add new
const createNewListing = async (req, res, next) => {
  // we use wrapAsync that's why i can't use try and catch
  try {
    let reponse = await geoCodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();



    const { title, description, price, location, country } = req.body;
    const newListing = new listingModel({
      title,
      description,
      price,
      location,
      country,
    });
    newListing.geometry = reponse.body.features[0].geometry;

    if (!req.file) {
      req.flash("error", "Image is required!");
      return res.redirect("/listings/new");
    }
    const imagePath = req.file.path;
    // console.log(imagePath);
    const imageUplaod = await cloudinary.uploader.upload(imagePath, {
      folder: "Wanderlust/Listings",
      quality: "auto",
      fetch_format: "auto",
    });

    // Delete the local file after upload
    fs.unlinkSync(imagePath);

    // console.log(imageUplaod)
    const url = imageUplaod.secure_url;
    const filename = imageUplaod.public_id;
    newListing.image = { url, filename };
    // newListing.image = imageUplaod.secure_url;

    newListing.owner = req.user._id;
    req.flash("success", "New Listing created!");
    const savedListing = await newListing.save();
    // console.log("savedListing",savedListing)
    res.redirect("/listings");
  } catch (error) {
    console.log("errorCloudUpload", { error: error.message });
    next(error);
  }
};

// edit show  routes one by one
const editListingForm = async (req, res) => {
  try {
    const id = req.params.id;
    const userListing = await listingModel.findById(id);
    // console.log("userlis",userListing)
    if (!userListing) {
      req.flash("error", " Listing Not Found!");

      return res.redirect("/listings");
    }
    const originaImage = userListing.image.url.replace(
      "/upload/",
      "/upload/w_200/blur:2000/",
    ); // ye image ko blur kr diyr width 200px kri di ye cloudinary ki transformation hai
        res.render("listings/edit.ejs", { userListing, originaImage });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// update route
const updateListing = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, price, location, country } = req.body;
    if (!req.file) {
      req.flash("error", "Image is required!");
      return res.redirect(`/listings/${id}/edit`);
    }
    const imagePath = req.file.path;
    const imageUplaod = await cloudinary.uploader.upload(imagePath, {
      folder: "Wanderlust/Listings",
      quality: "auto",
      fetch_format: "auto",
    });

    // Delete the local file after upload
    fs.unlinkSync(imagePath);

    // console.log(imageUplaod)
    const url = imageUplaod.secure_url;
    const filename = imageUplaod.public_id;

    await listingModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image: { url, filename },
        price,
        location,
        country,
      },
      { new: true },
    );

    req.flash("success", " Listing Updated successfully!");

    res.redirect(`/listings/${id}`);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// delete route
const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;
    await listingModel.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted successfully!");

    res.redirect("/listings");
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

export {
  showAllListings,
  newListingForm,
  showListingDetails,
  createNewListing,
  editListingForm,
  updateListing,
  deleteListing,
};
