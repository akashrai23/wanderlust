const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
// const {reviewSchema}= require("../schema.js"); 
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController= require("../controllers/reviews.js");
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
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
   
   //reviews
   //delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
   

module.exports= router; 