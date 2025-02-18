const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer');
const path = require('path');

const companyRouter = require('./Company.js');
const galleryRouter = require('./Gallery.js');
const blogRouter = require('./Blog.js');
const adRouter = require('./Ad.js');
const promoRouter = require('./promotion.js') 

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', companyRouter);
app.use('/', galleryRouter);
app.use('/', blogRouter);
app.use('/', adRouter);
app.use('/', promoRouter);

// Connect to MongoDB
const MONGODB_URI = "mongodb://localhost:27017/Marketing";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successful connection
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

