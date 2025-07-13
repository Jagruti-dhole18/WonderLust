const Review=require("../models/review");
const Listing=require("../models/listing");

//create
module.exports.createComment=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    
    let newReview = new Review(req.body.review);
        newReview.author=req.user._id;
    await newReview.save();
    
    // Ensure reviews array exists
    if (!listing.reviews) {
      listing.reviews = [];
    }
    
    listing.reviews.push(newReview._id);
    await listing.save();
    
    // console.log("new review saved");
     req.flash("success","New review created!!");
    res.redirect(`/listings/${id}`);
  }

  //delete
  module.exports.deleteComment=async(req,res)=>{
  let{id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
 req.flash("success"," review deleted!!");
  res.redirect(`/listings/${id}`)
}
