require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use("/images", express.static("upload/images"));

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGO_URI)
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
    image_url: `${process.env.BACKEND_URL}/images/${req.file.filename}`,
  });
});

// ===== MODELS =====
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
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
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ===== ROUTES =====
app.get("/", (req, res) => res.send("API running"));

app.post("/signup", async (req, res) => {
  const exists = await Users.findOne({ email: req.body.email });
  if (exists) return res.json({ success: false });

  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user || user.password !== req.body.password)
    return res.json({ success: false });

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
  res.json({ success: true, token });
});

// ===== CART =====
app.post("/addtocart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  const id = req.body.itemId.toString();

  user.cartData.set(id, (user.cartData.get(id) || 0) + 1);
  await user.save();

  res.json({ success: true, cartData: Object.fromEntries(user.cartData) });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  const id = req.body.itemId.toString();

  const qty = (user.cartData.get(id) || 0) - 1;
  qty <= 0 ? user.cartData.delete(id) : user.cartData.set(id, qty);
  await user.save();

  res.json({ success: true, cartData: Object.fromEntries(user.cartData) });
});

app.get("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json({ success: true, cartData: Object.fromEntries(user.cartData) });
});

// ===== PRODUCTS =====
app.get("/allproducts", async (_, res) => {
  res.json(await Product.find({}));
});
// ===== NEW COLLECTIONS =====
app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find({});
    const newCollections = products.slice(-8);
    res.json(newCollections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch new collections" });
  }
});

// ===== POPULAR IN WOMEN =====
app.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({ category: "women" }).limit(4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular women products" });
  }
});

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});