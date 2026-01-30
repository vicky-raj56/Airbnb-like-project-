import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { validateReview } from "../utils/validation.js";
import isLogedIn, { isReviewAuthor } from "../middlewares/isLogedIn.js";
import { createReview, deleteReview } from "../controllers/review.ctrl.js";

const router = express.Router({ mergeParams: true });
// yaha pe mergeParams iss liye use liye kiye q ki isme id dircect nhi aayaga gar aapne main js file route me id likha dete h h to o by default id nhi leta pata uska route h iss liye hme Router ye andar ye {margeParams:true} likhna hota h

// Reviews
// post route for save review
router.post("/reviews", isLogedIn, validateReview, wrapAsync(createReview));

// delete reviews route
router.delete(
  "/reviews/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(deleteReview),
);

export default router;
