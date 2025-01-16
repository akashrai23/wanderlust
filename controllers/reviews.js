const Listing= require("../models/listing");
const Review= require("../models/review")

module.exports.createReview= async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id); 
    console.log(req.params); 
    let newReview= new Review(req.body.review);
    newReview.author= req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   
   //  console.log("new review saved");
   //  res.send("new review saved");
   req.flash("success","New Review created");
   res.redirect(`/listings/${listing._id}`);
   }

module.exports.destroyReview= async(req,res)=>{
       let {id,reviewId}=req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//reviews array mai se reviewId KO PULL KAR DENGE YAANI DELETE KAR DENGE 
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Review Deleted");
       res.redirect(`/listings/${id}`);
}