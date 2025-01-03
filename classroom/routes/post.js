const express= require("express");
const router= express.Router(); 
//index
router.get("/",(req,res)=>{
    res.send("Get for post");
});

//show 
router.get("/:id",(req,res)=>{
    res.send("get for show post");
});

//post
router.post("/",(req,res)=>{
    res.send("post for post user");
});

//delete 
router.delete("/:id",(req,res)=>{
  res.send("delete for post id");
});

module.exports= router; 