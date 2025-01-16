const express= require("express");
const router= express.Router(); 
const wrapAsync= require("../utils/wrapAsync.js");
// const {listingSchema}= require("../schema.js"); 
// const ExpressError= require("../utils/ExpressError.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController= require("../controllers/listings.js");

//server-side validation for listings
// const validateListing=(req,res,next)=>{
//     let{error} = listingSchema.validate(req.body); 
    
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

//index route aur post route mai ek hi jagah request aa rahi hai "/" pe 
router
.route("/",)
.get(wrapAsync(listingController.index))
.post(validateListing, wrapAsync(listingController.createListing));


//Index Route 
// router.get("/",wrapAsync(listingController.index)); 

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); 
//Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

//Create Route
// app.post("/listings",wrapAsync(async(req,res,next)=>{
// //    let {title,description,image,price,country,location}= req.body; 
//     //   let listing= req.body.listing;
//     // console.log("Received Data:", req.body.listing);
//    if(!req.body.listing){
//     throw new ExpressError(400,"Send Valid data for listing"); 
//    }
//     const newListing= new Listing(req.body.listing);
//     await newListing.save(); 
//     res.redirect("/listings");
 
// }));

//post listing
// router.post("/",validateListing, wrapAsync(listingController.createListing));


//Edit Route
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm));

//Update Route 
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send Valid data for listing"); 
//        }
//     let {id}= req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
//     res.redirect(`/listings/${id}`); 
// })); 
//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));
//Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); 



module.exports= router; 