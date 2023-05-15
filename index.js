import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import postRoute from './routes/post.js'
import categoryRoute from './routes/categories.js'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.static("./public"))
// app.use("/images", express.static(path.join( __dirname, "/images")))
dotenv.config();
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

// const salt = await bcrypt.genSaltSync(12);
// const hash = await bcrypt.hashSync("hello", salt);
// console.log(hash);



//CONNECT TO DATABASE
mongoose.connect('mongodb://127.0.0.1:27017/BlogDB')
// mongoose.connect(process.env.MONGO_URL)
.then(console.log("connected to MongoDB Atlas"))
.catch(err => {
console.log(err);
});

//FILE UPLOADING
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {  
    cb(null, req.body.name)
  }
});
   
const upload = multer({ storage: storage });


app.post("/api/upload", upload.single("file"), async (req, res) =>{
  res.status(200).json('done')
})

//API ROUTES
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.listen(port, () =>{
  console.log("server is running on port " + port);
})