const port=4000;
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const path=require("path");
const cors=require('cors');
const { type } = require('os');

app.use(express.json());
app.use(cors());

// Database connection with MongoDB

mongoose.connect("mongodb+srv://atchyuthkarri46_db_user:Atchyuth_2005@cluster0.v2pifr4.mongodb.net/e-commerce");

// API Creation

app.get("/",(req,res)=>{
    res.send("Express is running");
})


//image storage engine

const storage=multer.diskStorage({
    destination:"./upload/images",
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}` )
    }
})

const upload=multer({storage:storage});

//creating upload Endpoint for images

app.use("/images",express.static("upload/images"));

app.post("/upload",upload.single("product"),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    });
})

//schema for creating products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post("/addproduct", async (req, res) => {
    try {
      let products = await Product.find({});
      let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;
  
      const product = new Product({
        id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: Number(req.body.new_price),
        old_price: Number(req.body.old_price),
        available: true,
      });
  
      await product.save();
      console.log("Product saved:", product);
  
      res.json({ success: true, product });
    } catch (error) {
      console.error("Add product error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

//creating api for deleting  a product

app.post("/removeproduct",async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//creating api for getting all products

app.get("/allproducts",async(req,res)=>{
    let products=await Product.find({});
    console.log("All Products Fetched");
    res.send(products)
})


//Schema creating for user model
const Users=mongoose.model("Users",{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now(),
    }
})

//Creating Endpoint for registering the user

app.post("/signup",async(req,res)=>{

    let check =await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,error:"Existing User Found With Same Email Address"})
    }
    let cart={};

    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data={
        user:{
            id:user.id,
        }
    }

    const token=jwt.sign(data,"secret_ecom");
    res.json({success:true,token})
})

//creating endpoint for user login

app.post("/login",async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if (user){
        const passCompare=req.body.password === user.password;
        if (passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,"secret_ecom");
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,error:"Wrong Email ID"})
    }
})


app.listen(port,(error)=>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ port)
    else {
        console.log("Error occurred, server can't start"+error);
    }
})