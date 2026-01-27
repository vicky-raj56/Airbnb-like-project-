import mongoose from "mongoose";
import reviewModel from "./review.model.js";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: function (v) {
      return v === ""
        ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v;
    },
  },

  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  // console.log(listing)
  if (listing) {
    await reviewModel.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listingModel = mongoose.model("listing", listingSchema);
export default listingModel;
