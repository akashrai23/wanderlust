const Listing= require("../models/listing");
module.exports.index= async (req,res)=>{
 const allListings = await Listing.find({});
//  console.log("All Listings:", allListings);
 res.render("listings/index.ejs",{allListings}); 
}

module.exports.renderNewForm= (req,res)=>{

   
    res.render("listings/new.ejs"); 
}

module.exports.showListing= async (req,res)=>{
    let {id}= req.params; 
   const listing=  await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings");
   }
   res.render("listings/show.ejs",{listing}); 
}

module.exports.createListing= async (req, res, next) => {
  

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
}

module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
       } 
   res.render("listings/edit.ejs",{listing}); 
}
  

module.exports.updateListing= async (req, res) => {
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
}

module.exports.destroyListing= async(req,res)=>{
     let {id}= req.params; 
    let deletedListing= await Listing.findByIdAndDelete(id);//jaise hi ye listing delete hogi vaise hi post middleware reviews ka call hoga aur saari listing delete kar dega 
    console.log(deletedListing); 
    req.flash("success","Listing Deleted!");
     res.redirect("/listings");  
}
