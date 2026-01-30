import mongoose from "mongoose";

// import {passportLocalMongoose} from "passport-local-mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose.default); // ye plugin add krne se hme username password ka schema alag se bnane ki jarurat nhi hoti
const userModel = mongoose.model("User", userSchema);
export default userModel;
