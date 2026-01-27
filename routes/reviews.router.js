import express from "express";
import reviewModel from "../models/review.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import listingModel from "../models/listing.model.js";

const router = express.Router();

// Reviews
// post route for save review
router.post(
  "/reviews",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const { rating, comment } = req.body;
    const findUser = await listingModel.findById(id);
    if (!findUser) {
      return res.send("user not found");
    }
    const review = new reviewModel({
      rating,
      comment,
    });
    findUser.reviews.push(review);
    const newReview = await review.save();
    await findUser.save();
    res.redirect(`/listings/${id}`);
  }),
);

// delete reviews route
router.delete(
  "/reviews/:reviewId",
  wrapAsync(async (req, res, next) => {
    // id: listngs user id, reviewId : user reviews id
    const { id, reviewId } = req.params;

    await listingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // yaha pe listing useer ke andar se pull kiye o reviews aur match kr ke delete kiye
    const reviewDelete = await reviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }),
);

export default router;
