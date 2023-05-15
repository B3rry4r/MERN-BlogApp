import express from "express";
import bcrypt from 'bcrypt'

import User from '../models/User.js';

const router = express.Router();


//Register
router.post("/register", async (req, res) =>{
    try {
        const salt = await bcrypt.genSalt(12);
        var hash = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })  
        const user = await newUser.save(); 
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Login
router.post("/login", async (req, res) =>{
    try {
        const user = await User.findOne({username: req.body.username})
        !user && res.status(400).json("Wrong Credentials")

        const validate = await bcrypt.compare(req.body.password, user.password)
        !validate && res.status(400).json("Wrong Credentials")

        const { password, ...others } = user._doc;
        res.status(200).json(others);  
    } catch (error) {
        res.status(500).json(error)
    }
})


export default router