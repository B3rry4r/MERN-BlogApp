import express from "express";
import bcrypt from 'bcrypt'
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();


//Update user credentials
router.put("/:id", async (req, res) =>{
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body
            },{new: true});
            res.status(200).json(updatedUser)
        } catch (error) {
            res.status(500).json(err)
        }
    } else {
        res.status(401).json("YOU CAN UPDATE OLY YOUR ACCOUNT")
    }

    
});

//Delete a User
router.delete("/:id", async (req, res) =>{
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("USER HAS BEEN DELETED");
            } catch (error) {
                res.status(500).json(err);
            }            
        } catch (err) {
            res.status(404).json("USER NOT FOUND");
        }
    } else {
        res.status(401).json("YOU CAN DELETE ONLY YOUR ACCOUNT")
    }

    
});

//Get User

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const{password, ...others} = user._doc
        res.status(200).json(others);   
    } catch (err) {
        res.status(500).json(err);
    }
})

export default router