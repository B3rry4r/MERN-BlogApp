import express from "express";
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();


//Create Post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update a Post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set:req.body
                },{new:true}
                );
                res.status(200).json(updatedPost)
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("YOU CAN UPDATE ONLY YOUR POST");

        }

    } catch (err) {
        res.status(500).json(err);

    }
});

//Delete a Post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json("POST HAS BEEN DELETED")
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("YOU CAN DELETE ONLY YOUR POST");

        }

    } catch (err) {
        res.status(500).json(err);

    }
});

//Get Post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);   
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get all Post

router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({username})
        } else if(catName) {
            posts = await Post.find({categories:{
                $in:[catName]
            }})
        } else{
            posts = await Post.find();
        }  
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
})

export default router