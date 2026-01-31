
import userModel from "../models/user.model.js";

// post route for signup
const createUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new userModel({ username, email });
      const registeredUser = await userModel.register(newUser, password);
      // console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to WonderLust!");
        res.redirect("/listings");
      });

      // console.log(registeredUser);
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  };

// post route for login

export { createUser };