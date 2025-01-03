const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
// const {reviewSchema}= require("../schema.js"); 
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");

//server side validation function of reviews
// const validateReview=(req,res,next)=>{
//     let{error} = reviewSchema.validate(req.body); 
    
//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send Valid data for listing");
//     // }
//     if(error){
//         let errMsg= error.details.map((el)=>el.message).join(",");

//         throw new ExpressError(400,errMsg); 
//     }else{
//         next(); 
//     }
// }

//reviews 
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
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
   }));
   
   //reviews
   //delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
       let {id,reviewId}=req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//reviews array mai se reviewId KO PULL KAR DENGE YAANI DELETE KAR DENGE 
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Review Deleted");
       res.redirect(`/listings/${id}`);
}))
   

module.exports= router; 