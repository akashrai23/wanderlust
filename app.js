const express= require("express"); 
const app= express(); 
const mongoose= require("mongoose"); 
const Listing= require("./models/listing.js");
const path= require("path"); 
const methodOverride= require("method-override");
const { runInNewContext } = require("vm");
const ejsMate= require("ejs-mate"); 
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js"); 
const Review= require("./models/review.js");
const review = require("./models/review.js");
const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const session= require("express-session");  
const flash= require("connect-flash");
const passport= require("passport"); 
const LocalStrategy = require("passport-local"); 
const User= require("./models/user.js"); 



app.get("/",(req,res)=>{
    res.send("Hi  i am root"); 
})

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB"); 
}).catch((err)=>{
    console.log(err); 
})

async function main(){
    await mongoose.connect(MONGO_URL); 
}

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //jo bhi data req mai aaiga vo parse ho jaiga 
app.use(methodOverride("_method")); 
app.engine("ejs",ejsMate); 
app.use(express.static(path.join(__dirname,"/public"))); 

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 *1000,// to enable it for 1 week 7days
        maxAge:7 * 24 * 60 * 60 *1000,
        httpOnly:true, //to prevent from cross site scripting attack
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser= req.user;
    next(); 
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//    let registeredUser= await User.register(fakeUser,"helloworld!");//helloworld is password//User ka register method automatically
//     //  save karva dega database mai fakeuser aur uska password helloworld.  
//     res.send(registeredUser);
    
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




// app.get("/testListing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",

//     });
//  await sampleListing.save(); 
//  console.log("sample was saved"); 
//  res.send("successful testing"); 
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!")); 
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}= err; 
    // res.status(statusCode).send(message); 
    res.status(statusCode).render("error.ejs",{message}); 
}); 

app.listen(8080,()=>{
    console.log("server is listening to port 8080"); 
});

