const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");
const { ref } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename:String
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
 geo: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
  // rating:{
  //     type:Number,
  // },
    reviews: {
    type: [ { type: Schema.Types.ObjectId, ref: "Review" } ],
    default: []
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

listingSchema.index({ geo: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
