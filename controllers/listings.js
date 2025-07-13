const Listing=require("../models/listing");
const axios = require("axios");
require('dotenv').config();

//index
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  // res.send("success");
}

//new
module.exports.renderNewForm= (req, res) => {
  res.render("listings/new.ejs");
}

//show
module.exports.showListing=async (req, res, next) => {
    let { id } = req.params;
    console.log("About to call populate on Listing.findById");
    let listing;
    try {
      // Defensive: Only populate if fields exist in schema
      const populateReviews = { path: "reviews", populate: { path: "author" } };
      const populateOwner = "owner";
      listing = await Listing.findById(id)
        .populate(populateReviews)
        .populate(populateOwner);
      console.log("Listing after populate:", listing);
    } catch (err) {
      console.error("Error during populate:", err);
      // Fallback: Try without populate if error is due to path
      if (err && err.message && err.message.includes("path")) {
        try {
          listing = await Listing.findById(id);
          console.log("Listing loaded without populate:", listing);
        } catch (fallbackErr) {
          console.error("Fallback error:", fallbackErr);
          return next(fallbackErr);
        }
      } else {
        return next(err);
      }
    }
    if (!listing) {
      req.flash("error", "Requested listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

  //create
module.exports.createNewListing = async (req, res, next) => {
  try {
    const { listing } = req.body;

    const url = req.file.path;
    const filename = req.file.filename;

    const locationQuery = encodeURIComponent(`${listing.location}, ${listing.country}`);
    const geoURL = `https://nominatim.openstreetmap.org/search?q=${locationQuery}&format=json`;

    const geoRes = await axios.get(geoURL, {
      headers: {
        "User-Agent": process.env.MAP_INFO,
      }
    });

    const geoData = await geoRes.data;

    let coordinates = [78.9629, 20.5937]; // Default to India center

    if (geoData && geoData.length > 0) {
      const lat = parseFloat(geoData[0].lat);
      const lng = parseFloat(geoData[0].lon);
      coordinates = [lng, lat]; // GeoJSON format: [lng, lat]
    }

    const newListing = new Listing({
      ...listing,
      owner: req.user._id,
      image: { url, filename },
      geo: {
        type: "Point",
        coordinates: coordinates
      }
    });

    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};


  //edit
  module.exports.renderEditForm=async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Requested listing does not exist!");
        return res.redirect("/listings");
      }

     let originalImageUrl= listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
      res.render("listings/edit.ejs", { listing ,originalImageUrl});
    }

    //update
    module.exports.updateListing=async (req, res) => {
        // if (!req.body.listing) {
        //   throw new ExpressError(400, "Send valid data for listing!!");
        // }
        let { id } = req.params;
        let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 if(typeof req.file !== "undefined"){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
 }
        req.flash("success", "listing updated!!");
        res.redirect("/listings");
      }

      //delete
      module.exports.deleteListing=async (req, res) => {
          let { id } = req.params;
          let deletedListing = await Listing.findByIdAndDelete(id);
          // console.log(deletedListing);
          req.flash("success", "listing deleted!!");
          res.redirect("/listings");
        }