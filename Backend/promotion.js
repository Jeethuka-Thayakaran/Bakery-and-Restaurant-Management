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
const promoSchema = mongoose.Schema({
    image: String,
}, {
    timestamps: true
});

const Promo = mongoose.model("promo", promoSchema);

// Read
router.get("/api/Promotion", async (req, res) => {
    try {
        const data = await Promo.find({});
        res.json({ success: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Create
router.post("/api/Promotion/create", upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file ? req.file.path : null; // Get the uploaded image path
        const promo = new Promo({
            image: imagePath ? `http://localhost:4000/${imagePath.replace(/\\/g, '/')}` : null,
        });
        await promo.save();
        res.json({ success: true, message: "Promotion created successfully", data: promo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Delete
router.delete("/api/Promotion/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPromo = await Promo.findByIdAndDelete(id);

        if (deletedPromo) {
            res.json({ success: true, message: "Promotion deleted successfully", data: deletedPromo });
        } else {
            res.status(404).json({ success: false, message: "Promotion not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
