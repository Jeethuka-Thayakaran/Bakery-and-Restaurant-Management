const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

//schema
const schemadata = mongoose.Schema({
    address : String,
    email : String,
    mobile : Number,
 },{
    timestamps : true
 })
 const usermodel = mongoose.model("user",schemadata)
 
 //read
 router.get("/api/Company",async(req,res)=>
 {
    const data = await usermodel.find({})
    res.json({success : true , data : data})
 })
 
 /*router.post("/api/Company/create",async(req,res)=>{
    console.log(req.body)
    const data = new usermodel(req.body)// 1st no
    await data.save()//1st no
    res.send({success : true, message : "data saved successfully", data : data})
})*/

 //update

 router.put("/api/Company/update",async(req,res)=>{
    console.log(req.body)
    const { _id,...rest} = req.body
    console.log(rest)
    const data = await usermodel.updateOne({_id : _id},rest)
    res.send({success : true, message : "data updated successfully", data : data})
 })


module.exports = router;