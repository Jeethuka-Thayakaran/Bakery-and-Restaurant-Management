const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

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
    name: String,
    description: String,
    price: Number
  }, {
    timestamps: true
  });
  
  const usermodel = mongoose.model("post", schemadata);
  
  // Read
  router.get("/api/Gallery", async (req, res) => {
    try {
      const data = await usermodel.find({});
      res.json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  // Create
  router.post("/api/Gallery/create", upload.single('image'), async (req, res) => {
    try {
      const { name, description, price} = req.body;
      const imagePath = req.file ? req.file.path : null; // Get the uploaded image path
      const blog = new usermodel({
        name,
        description,
        price,
        image: imagePath ? `http://localhost:4000/${imagePath.replace(/\\/g, '/')}` : null, // Store image URL
      });
      await blog.save();
      res.json({ success: true, message: "Gallery post created successfully", data: blog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // Update
  router.put("/api/Gallery/update", async (req, res) => {
    console.log(req.body)
    const { _id,...rest} = req.body
    console.log(rest)
    const data = await usermodel.updateOne({_id : _id},rest)
    res.send({success : true, message : "data updated successfully", data : data})
  });
   
  // Delete
  router.delete("/api/Gallery/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBlog = await usermodel.findByIdAndDelete(id);
  
      if (deletedBlog) {
        res.json({ success: true, message: "Blog post deleted successfully", data: deletedBlog });
      } else {
        res.status(404).json({ success: false, message: "Blog post not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


  module.exports = router;