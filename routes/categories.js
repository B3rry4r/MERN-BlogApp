import express from "express";
const router = express.Router();
import Category from '../models/Category.js';

//Post Category
router.post("/", async (req, res) => {
    const newCat = new Category(req.body);
    try {
        const savedCategory = await newCat.save();
        res.status(200).json(savedCategory);   
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get all Categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);   
    } catch (err) {
        res.status(500).json(err);
    }
})


export default router