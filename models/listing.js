const mongoose= require("mongoose"); 
const Schema= mongoose.Schema; 
const Review= require("./review.js");

const listingSchema=  new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename: String,
        url: String, // Define image as an object with filename and url
      },
    price: Number,
    location: String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
       type:Schema.Types.ObjectId,
       ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
      
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}}); //listing reviews ke andar jitni bhi id hongi vo delete ho jaingi
    }
    
});


const Listing= mongoose.model("Listing", listingSchema); 
module.exports= Listing; 