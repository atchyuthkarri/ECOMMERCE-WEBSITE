const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// ================= MONGODB CONNECTION =================
mongoose
  .connect(
    "mongodb+srv://atchyuthkarri46_db_user:Atchyuth_2005@cluster0.v2pifr4.mongodb.net/e-commerce"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= BASIC API =================
app.get("/", (req, res) => {
  res.send("Express is running");
});

// ================= IMAGE UPLOAD =================
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// ================= PRODUCT SCHEMA =================
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// ================= ADD PRODUCT =================
app.post("/addproduct", async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: Number(req.body.new_price),
      old_price: Number(req.body.old_price),
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= REMOVE PRODUCT =================
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true });
});

// ================= GET ALL PRODUCTS =================
app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

// ================= USER SCHEMA =================
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: false, error: "Wrong Email ID" });
  }

  if (req.body.password !== user.password) {
    return res.json({ success: false, error: "Wrong Password" });
  }

  const token = jwt.sign({ user: { id: user._id } }, "secret_ecom");
  res.json({ success: true, token });
});

// ================= NEW COLLECTION =================
app.get("/newcollections", async (req, res) => {
  const products = await Product.find({});
  const newcollection = products.slice(-8);
  res.send(newcollection);
});

// ================= POPULAR IN WOMEN =================
app.get("/popularinwomen", async (req, res) => {
  const products = await Product.find({ category: "women" });
  res.send(products.slice(0, 4));
});

// ================= AUTH MIDDLEWARE =================
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// =================CREATING ENDPOINT FOR ADDING PRODUCTS IN CARTDATA =================
app.post("/addtocart", fetchUser, async (req, res) => {
    console.log("Added",req.body.itemId);
    try {
      const itemId = req.body.itemId;
      const user = await Users.findOneAndUpdate(
        { _id: req.user.id },
        { $inc: { [`cartData.${itemId}`]: 1 } },
        { new: true }
      );
      res.json({ success: true, cartData: user.cartData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

//creating endpoint to remove product from cart data
app.post("/removefromcart", fetchUser, async (req, res) => {
    const itemId = req.body.itemId;
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, error: "User not found" });
  
      // Safely decrement using $inc
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { $inc: { [`cartData.${itemId}`]: -1 } },
        { new: true }
      );
  
      // Fetch updated user
      const updatedUser = await Users.findById(req.user.id);
      // Ensure no negative quantities
      for (let key in updatedUser.cartData) {
        if (updatedUser.cartData[key] < 0) updatedUser.cartData[key] = 0;
      }
      await updatedUser.save();
  
      res.json({ success: true, cartData: updatedUser.cartData });
    } catch (err) {
      console.error("Remove from cart error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });


  app.get("/getcart", fetchUser, async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false });
      res.json({ success: true, cartData: user.cartData });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

// ================= START SERVER =================
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});