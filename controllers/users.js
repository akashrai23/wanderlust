const User= require("../models/user");


module.exports.rendersignupForm= (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup= async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        const newUser= new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
}

module.exports.renderloginForm= (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login= async(req,res)=>{
    //to authenticate user whether the user who is trying to login exist in database or not. this work will be
    //done by passport as a middleware so we wrote passport.authenticate
req.flash("success","Welcome back to WanderLust!");
// res.redirect("/listings");
let redirectUrl= res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);}


module.exports.logout= (req,res,next)=>{
    req.logout((err)=>{
     if(err){
        return next(err);
     }
     req.flash("success","you are logged out");
     res.redirect("/listings");
    })
 }