import reviewModel from "../models/review.model.js";

import listingModel from "../models/listing.model.js";

// post route for save review
const createReview = async (req, res) => {
  const id = req.params.id;
  const { rating, comment } = req.body;
  const findUser = await listingModel.findById(id);
  if (!findUser) {
    return res.send("user not found");
  }
  const review = new reviewModel({
    rating,
    comment,
    createdAt: Date.now(),
  });
  review.author = req.user._id; // yaha pe hmne review ke andar author me current logged in user ka id save kr diya
  findUser.reviews.push(review);
  const newReview = await review.save();
  await findUser.save();
  req.flash("success", "New Review created!");

  res.redirect(`/listings/${id}`);
};

// delete reviews route
const deleteReview = async (req, res, next) => {
  // id: listngs user id, reviewId : user reviews id
  const { id, reviewId } = req.params;

  await listingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // yaha pe listing useer ke andar se pull kiye o reviews aur match kr ke delete kiye
  const reviewDelete = await reviewModel.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted successfully!");

  res.redirect(`/listings/${id}`);
};

export { createReview, deleteReview };
