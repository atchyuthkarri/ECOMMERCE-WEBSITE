const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use("/images", express.static("upload/images"));

// ===== MONGODB CONNECTION =====
mongoose
  .connect(
    "mongodb+srv://atchyuthkarri46_db_user:Atchyuth_2005@cluster0.v2pifr4.mongodb.net/e-commerce"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== IMAGE UPLOAD =====
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// ===== MODELS =====
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

const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: { type: Map, of: Number, default: {} },
  date: { type: Date, default: Date.now },
});

// ===== AUTH MIDDLEWARE =====
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Authentication token missing" });

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ===== PRODUCT ROUTES =====
app.get("/", (req, res) => res.send("Express is running"));

app.post("/addproduct", async (req, res) => {
  try {
    const lastProduct = await Product.findOne({}).sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

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
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.get("/newcollections", async (req, res) => {
  const products = await Product.find({});
  res.json(products.slice(-8));
});

app.get("/popularinwomen", async (req, res) => {
  const products = await Product.find({ category: "women" });
  res.json(products.slice(0, 4));
});

// ===== USER ROUTES =====
app.post("/signup", async (req, res) => {
  try {
    const check = await Users.findOne({ email: req.body.email });
    if (check) return res.status(400).json({ success: false, error: "User already exists" });

    const user = new Users({
      name: req.body.username || req.body.name,
      email: req.body.email,
      password: req.body.password,
      cartData: {}, // empty cart
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, "secret_ecom");
    res.json({ success: true, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.json({ success: false, error: "Wrong Email ID" });
    if (req.body.password !== user.password) return res.json({ success: false, error: "Wrong Password" });

    const token = jwt.sign({ user: { id: user._id } }, "secret_ecom");
    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== CART ROUTES =====
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    const itemId = req.body.itemId.toString();
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const currentQty = user.cartData.get(itemId) || 0;
    user.cartData.set(itemId, currentQty + 1);
    await user.save();

    const filteredCart = {};
    user.cartData.forEach((qty, key) => {
      if (qty > 0) filteredCart[key] = qty;
    });

    res.json({ success: true, cartData: filteredCart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const itemId = req.body.itemId.toString();
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const currentQty = user.cartData.get(itemId) || 0;
    if (currentQty > 0) user.cartData.set(itemId, currentQty - 1);

    // Remove zero or negative items
    user.cartData.forEach((qty, key) => {
      if (qty <= 0) user.cartData.delete(key);
    });

    await user.save();

    const filteredCart = {};
    user.cartData.forEach((qty, key) => {
      if (qty > 0) filteredCart[key] = qty;
    });

    res.json({ success: true, cartData: filteredCart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/getcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false });

    const filteredCart = {};
    user.cartData.forEach((qty, key) => {
      if (qty > 0) filteredCart[key] = qty;
    });

    res.json({ success: true, cartData: filteredCart });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== START SERVER =====
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});