const express= require("express");
const router= express.Router();

//index route
router.get("/",(req,res)=>{
    res.send("Get for users");
});

//show -users
router.get("/:id",(req,res)=>{
    res.send("get for show user");
});

//post for users
router.post("/",(req,res)=>{
    res.send("post for show user");
});

//delete users
router.delete("/:id",(req,res)=>{
  res.send("delete for user id");
});

module.exports= router;