import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import listingModel from "./models/listing.model.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate"; 

dotenv.config();
const app = express();

// middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

// connect database to server
connectDB();

// setting up ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Api routes

// index route to show all listings
app.get("/listings", async (req, res) => {
  try {
    const allListings = await listingModel.find({});
    res.render("listings/index", { allListings });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// new listing form route
app.get("/listings/new", (req, res) => {
  try {
    res.render("listings/new.ejs");
  } catch (error) {
    res.status(500).send("Server Error", error.message);
  }
});

// show route to show single listing details
app.get("/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await listingModel.findById(id);
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// create route to add new
app.post("/listings", (req, res) => {
  try {
    const { title, description, image, price, location, country } = req.body;
    const newListing = new listingModel({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    newListing.save();
    res.redirect("/listings");
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// edit routes one by one

app.get("/listings/:id/edit",async (req,res)=>{
  try {
    const id = req.params.id;
     const userListing = await listingModel.findById(id);
    res.render("listings/edit.ejs",{userListing})
  } catch (error) {
    res.status(500).send("Server Error");
    
  }
})
// update route
app.put("/listings/:id",async (req,res)=>{
  try {
    const id = req.params.id;
    const {title,description,image,price,location,country} = req.body;
    await listingModel.findByIdAndUpdate(id,{
      title,
      description,
      image,
      price,
      location,
      country,
    },{new:true});
    res.redirect(`/listings/${id}`);
  }
    catch (error) {
    res.status(500).send("Server Error");
  } 

})

// delete route
app.delete("/listings/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    await listingModel.findByIdAndDelete(id);
    res.redirect("/listings");
    
  } catch (error) {
    res.status(500).send("Server Error");
    
  }
})









// app.get("/", (req, res) => {
//   res.send("Hello, Airbnb!");
// });

// database Testing

// app.get("/testListing",async (req,res)=>{
//   const sampleTesting = new listingModel({
//     title:"my new villa",
//     description:"by the beach",
//     price:1500,
//     location:"gangti,muzaffarpur",
//     country:"india",
//   });
//   const newData = await sampleTesting.save();
//   console.log(newData);
//   res.send("Data saved successfully")

// })

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
