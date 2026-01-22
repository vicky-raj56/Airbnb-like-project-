import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
    image: {

      type: String,
      default:
        "https://unsplash.com/photos/woman-walking-along-the-street-bgoE05DFF9U",
      set: function (v) {
        return v === ""
          ? "https://unsplash.com/photos/woman-walking-along-the-street-bgoE05DFF9U"
          : v;
      },
    },

  //   image: {
  //     filename: {
  //       type: String,
  //     },
  //     url: {
  //       type: String,
  //       default:
  //         "https://unsplash.com/photos/woman-walking-along-the-street-bgoE05DFF9U",
  //       set: function (v) {
  //         return v === ""
  //           ? "https://unsplash.com/photos/woman-walking-along-the-street-bgoE05DFF9U"
  //           : v;
  //       },
  //     },
  //   },

  price: Number,
  location: String,
  country: String,
});
const listingModel = mongoose.model("listing", listingSchema);
export default listingModel;
