require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use("/images", express.static("upload/images"));

// ===== RESPONSE HELPER (IMPORTANT) =====
const sendResponse = (res, status, success, data = [], message = "") => {
  res.status(status).json({ success, data, message });
};

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ===== IMAGE UPLOAD =====
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("product"), (req, res) => {
  sendResponse(res, 200, true, [
    `${process.env.BACKEND_URL}/images/${req.file.filename}`,
  ]);
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
  available: Boolean,
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
  if (!token) return sendResponse(res, 401, false, [], "Token missing");

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    sendResponse(res, 401, false, [], "Invalid token");
  }
};

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  sendResponse(res, 200, true, [], "API running");
});

// ===== AUTH =====
app.post("/signup", async (req, res) => {
  const exists = await Users.findOne({ email: req.body.email });
  if (exists) return sendResponse(res, 400, false, [], "User exists");

  const user = new Users(req.body);
  await user.save();

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
  sendResponse(res, 200, true, [token], "Signup successful");
});

app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user || user.password !== req.body.password)
    return sendResponse(res, 400, false, [], "Invalid credentials");

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
  sendResponse(res, 200, true, [token], "Login successful");
});

// ===== CART =====
app.post("/addtocart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  const id = req.body.itemId.toString();

  user.cartData.set(id, (user.cartData.get(id) || 0) + 1);
  await user.save();

  sendResponse(res, 200, true, [Object.fromEntries(user.cartData)], "Added to cart");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  const id = req.body.itemId.toString();

  const qty = (user.cartData.get(id) || 0) - 1;
  qty <= 0 ? user.cartData.delete(id) : user.cartData.set(id, qty);
  await user.save();

  sendResponse(res, 200, true, [Object.fromEntries(user.cartData)], "Removed from cart");
});

app.get("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  sendResponse(res, 200, true, [Object.fromEntries(user.cartData)], "Cart fetched");
});

// ===== PRODUCTS =====
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    sendResponse(res, 200, true, products, "All products fetched");
  } catch {
    sendResponse(res, 500, false, [], "Failed to fetch products");
  }
});

app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find({});
    sendResponse(res, 200, true, products.slice(-8), "New collections fetched");
  } catch {
    sendResponse(res, 500, false, [], "Failed to fetch collections");
  }
});

app.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: /^women$/i }
    }).limit(4);

    sendResponse(res, 200, true, products, "Popular women products fetched");
  } catch {
    sendResponse(res, 500, false, [], "Failed to fetch popular products");
  }
});

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});