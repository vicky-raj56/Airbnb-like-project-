// utils/validation.js
import joi from "joi";
// 🔹 Schema
const listingSchema = joi.object({
  title: joi.string().required(),
  price: joi.number().min(0).required(),
  description: joi.string().required(),
  image: joi.string().uri().required(),
  location: joi.string().required(),
  country: joi.string().required(),
});

// 🔹 Middleware
function validateListing(req, res, next) {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    req.flash("error", ` ${error.details[0].message}`);
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next(); // sab theek hai → route continue
}

// reviews validation

const reviewSchema = joi.object({
  rating: joi.number().min(1).max(5).required(),
  comment: joi.string().required(),
});

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    req.flash("error", ` ${error.details[0].message}`);
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
}

// Sign up validation can be added similarly

const userSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
function validateUser(req, res, next) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    req.flash("error", ` ${error.details[0].message}`);
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
}

export { validateListing, validateReview, validateUser };
