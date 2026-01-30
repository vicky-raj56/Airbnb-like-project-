import listingModel from "../models/listing.model.js";
import reviewModel from "../models/review.model.js";

function isLogedIn(req, res, next) {
  // console.log(req.path ,"....",req.originalUrl); // ye path aur ,original url check krne ke liye hai ye pura path aur url batata hai jise aap redirect kr skte ho login krne ke baad
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // ye line hme o url store krne ke liye hai jaha se wo aya tha taki login krne ke baad waha redirect kr ske
    req.flash("error", " You must be logged in first!");
    return res.redirect("/login");
  }
  next();
}
export default isLogedIn;

function saveRedirectUrl(req, res, next) {
  if (!req.isAuthenticated()) {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
  }
  next();
}



// is Owner middleware can be added similarly
async function isOwner(req, res, next) {
   try {
    const id = req.params.id;
      const listing = await listingModel.findById(id);
      if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", " You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
      }
      next()
   } catch (error) {
    req.flash("error", " You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
   }
}

// is auhtor middleware can be added similarly
async function isReviewAuthor(req, res, next) {
   try {
  const { id, reviewId } = req.params;
      const Review = await reviewModel.findById(reviewId);
      if (!Review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", " You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
      }
      next()
   } catch (error) {
    req.flash("error", " You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
   }
}
export { saveRedirectUrl ,isOwner,isReviewAuthor};


