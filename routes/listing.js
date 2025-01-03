const express= require("express");
const router= express.Router(); 
const wrapAsync= require("../utils/wrapAsync.js");
// const {listingSchema}= require("../schema.js"); 
// const ExpressError= require("../utils/ExpressError.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");


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
//Index Route 
router.get("/",wrapAsync(async (req,res)=>{
 const allListings = await Listing.find({});
//  console.log("All Listings:", allListings);
 res.render("listings/index.ejs",{allListings}); 
})); 

//New Route
router.get("/new",isLoggedIn,(req,res)=>{

   
    res.render("listings/new.ejs"); 
})


//Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params; 
   const listing=  await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings");
   }
   res.render("listings/show.ejs",{listing}); 
}));

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


router.post("/",validateListing, wrapAsync(async (req, res, next) => {
  

    const { title, description, price, country, location } = req.body.listing;
    const image = req.body.listing.image?.url || 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60';

    const newListing = new Listing({
        title,
        description,
        image: { url: image },
        price,
        country,
        location
    });
    console.log(req.user);
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
       } 
   res.render("listings/edit.ejs",{listing}); 
}));

//Update Route 
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send Valid data for listing"); 
//        }
//     let {id}= req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
//     res.redirect(`/listings/${id}`); 
// })); 
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send Valid data for listing");
    // }

    const { id } = req.params;
    const { image, ...rest } = req.body.listing;
    const updatedImage = image?.url || 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60';
     
    // let listing=await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){   //authorizAtion for listing updation
    //     req.flash("error","you don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id, {
        ...rest,
        image: { url: updatedImage }
    });
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}));
//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
     let {id}= req.params; 
    let deletedListing= await Listing.findByIdAndDelete(id);//jaise hi ye listing delete hogi vaise hi post middleware reviews ka call hoga aur saari listing delete kar dega 
    console.log(deletedListing); 
    req.flash("success","Listing Deleted!");
     res.redirect("/listings");  
})); 



module.exports= router; 