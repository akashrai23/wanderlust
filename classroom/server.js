const express= require("express"); 
const app= express(); 
const users= require("./routes/user.js");
const posts= require("./routes/post.js");
const session= require("express-session"); 
const flash= require("connect-flash");
const path= require("path");
app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views"));
// const cookieParser= require("cookie-parser"); 

// // app.use(cookieParser()); 
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//  res.cookie("made-in","India",{signed:true});
//  res.send("signed cookie sent");
// });

// //to check our signed cookie is not tampered
// app.get("/verify",(req,res)=>{
//   console.log(req.cookies);//unsigned cookies hi print hongi 
//   console.log(req.signedCookies);//signed cookies dikhengi
//   res.send("verified");
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("sent you some cookies");
// })

// app.get("/greet",(req,res)=>{
//     let {name}= req.cookies;
//     res.send(`Hi ${name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi i am root"); 
// })

// app.use("/users",users);// ab jo request aaigi vo sabhi request jo users ke andar hain aur / se start ho rahi
// //  hai usse match  hongi aur jab koi request jo users se match hogi usko vo response bhej dega
// //jitni bhi request /users se start hone vaali aaingi ussey users file mai jaake match karengi.
// app.post("/posts",posts);



// EXPRESS SESSIONS




// app.use(session({secret:"mysupersecretstring",
//   resave:false,
//   saveUninitialized:true,

// }));

// app.get("/test",(req,res)=>{
//   res.send("test successful");
// });



//express session count 

// app.get("/reqcount",(req,res)=>{
//      if(req.session.count){
//       req.session.count++;
//      }
//      else{
//       req.session.count=1;
//      }

//      res.send(`you sent a request ${req.session.count} times`); 
// });

const sessionOptions= session({
  secret:"mysupersecretstring",
  resave:false,
  saveUninitialized:true,
});


app.use(sessionOptions);
app.use(flash());

app.use((req,res,next)=>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  next();
})


app.get("/register",(req,res)=>{
  let {name="anonymous"}= req.query;
  req.session.name=name;
  // console.log(req.session.name);
  // res.send(name);
  if(name==="anonymous"){
    req.flash("error","user not registered");
  }
  else{
    req.flash("success","user registered successfully");
  }
  // req.flash("success","user registered successfully!");
  res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
  // console.log(req.flash("success"));
  // res.locals.successMsg= req.flash("success");
  // res.locals.errorMsg= req.flash("error");
res.render("page.ejs",{name:req.session.name});
// res.send(`hello,${req.session.name}`)
});

app.listen(3000,()=>{
  console.log("server is listening to 3000"); 
})