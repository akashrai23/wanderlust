const mongoose= require("mongoose"); 
const Schema= mongoose.Schema; 
const passportLocalMongoose= require("passport-local-mongoose");

//passportlocalmongoose automatically defines username and password. in hashed form and salt it. so we 
//don't need to add username and password. 
const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model('User',userSchema);