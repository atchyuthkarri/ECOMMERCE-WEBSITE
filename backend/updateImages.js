require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

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

const updateImages = async () => {
  const products = await Product.find();
  for (let p of products) {
    if (p.image.includes("localhost")) {
      p.image = p.image.replace("http://localhost:4000", process.env.BACKEND_URL);
      await p.save();
      console.log(`Updated: ${p.name}`);
    }
  }
  console.log("All images updated!");
  mongoose.disconnect();
};

updateImages();