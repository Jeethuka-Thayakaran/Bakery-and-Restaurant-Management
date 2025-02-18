const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { title } = require('process');

const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/'); // Upload files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Keep the original file name
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Schema
  const schemadata = mongoose.Schema({
    image: String,
    title: String,
    body: String,
    sDate: Date,
    eDate: Date
  }, {
    timestamps: true
  });
  
  const usermodel = mongoose.model("ad", schemadata);
  
  // Read
  router.get("/api/Ad", async (req, res) => {
    try {
      const data = await usermodel.find({});
      res.json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  // Create
  router.post("/api/Ad/create", upload.single('image'), async (req, res) => {
    try {
      const { title, body, sDate, eDate} = req.body;
      const imagePath = req.file ? req.file.path : null; // Get the uploaded image path
      const blog = new usermodel({
        title,
        body,
        sDate,
        eDate,
        image: imagePath ? `http://localhost:4000/${imagePath.replace(/\\/g, '/')}` : null,
      });
      await blog.save();
      res.json({ success: true, message: "Ad created successfully", data: blog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // Update
  router.put("/api/Ad/update", async (req, res) => {
    console.log(req.body)
    const { _id,...rest} = req.body
    console.log(rest)
    const data = await usermodel.updateOne({_id : _id},rest)
    res.send({success : true, message : "Ad updated successfully", data : data})
  });
   
  // Delete
  router.delete("/api/Ad/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBlog = await usermodel.findByIdAndDelete(id);
  
      if (deletedBlog) {
        res.json({ success: true, message: "Ad deleted successfully", data: deletedBlog });
      } else {
        res.status(404).json({ success: false, message: "Ad not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


  module.exports = router;